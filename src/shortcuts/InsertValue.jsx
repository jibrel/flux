import Shortcut from './Shortcut';
import Lang from 'lodash';
import CreatorBase from './CreatorBase';

export default class InsertValue extends Shortcut {
    constructor(onUpdate, metadata, patient, shortcutData) {
        super();
        this.metadata = metadata;
        this.text = null;
        this.originalText = null;
        this.patient = patient;
        this.wasRemovedFromContext = false;
        this._shouldRemoveFromContext = false;
    }

    initialize(contextManager, trigger = undefined, updatePatient = true, shortcutData = "") {
        super.initialize(contextManager, trigger, updatePatient);
        if (Lang.isUndefined(this.parentContext)) {
            super.determineParentContext(contextManager, this.metadata["knownParentContexts"], this.metadata["parentAttribute"]);
        }
        if (Lang.isNull(shortcutData)) {
            shortcutData = "";
        }
        if (!Lang.isUndefined(this.parentContext) && this.parentContext.children.indexOf(this) === -1) {
            this.parentContext.addChild(this);
        }

        const text = this.determineText(contextManager);
        if (Lang.isArray(text)) {
            this.flagForTextSelection(text);
        } else {
            if (shortcutData) {
                if (shortcutData.length > 0) this.setText(shortcutData);
            }
            else this.setText(text);
        }

        if (this.needToSelectValueFromMultipleOptions() && shortcutData.length > 0) {
            // Parse shortcutData and find value object by entryId
            const shortcutDataObj = JSON.parse(shortcutData);
            this.text = shortcutDataObj.text;
            if (shortcutDataObj.originalText) this.setOriginalText(shortcutDataObj.originalText);

            const valueObject = this.patient.getEntryById(shortcutDataObj.entryId);
            this.setValueObject(valueObject);
            this.setWasRemovedFromContext(shortcutDataObj.wasRemovedFromContext);
            if (shortcutDataObj.wasRemovedFromContext) {
                this._shouldRemoveFromContext = true;
            }
        } else if (this.valueObject && this.parentContext) {
            // If shortcut is being re-initialized and valueObject is already set, we might need to set it on the parent now
            this.setValueObject(this.valueObject);
        }
    }

    getPrefixCharacter() {
        return "@";
    }

    _getValueUsingPath(item, attributePath) {
        let result = item, i;
        for (i = 0; i < attributePath.length; i++) {
            result = result[attributePath[i]];
        }
        return result;
    }

    // callSpec: {"object": "patient | $parentValueObject", "method":"<methodName>"}
    // callSpec: {"object": "patient | $parentValueObject", "method":"<methodName>", "itemKey": "<itemKey>", "itemContext":"<itemContext>", "dateLabel":"<dateLabel>"}
    // callSpec: {"object": "parent", "attribute":"<attributeName>"}
    // callSpec: {"string": "<string with ${x} expressions", "params": { "x": <callSpec>}}
    _resolveCallSpec(callSpec, contextManager, selectedValue) {
        let result;
        const callObject = callSpec["object"];
        const string = callSpec["string"];
        if (Lang.isUndefined(callObject)) {
            if (!Lang.isUndefined(string)) {
                const params = callSpec["params"];
                result = "";
                let start = 0, callId;
                let index = string.indexOf("${"), index2;
                while (index !== -1) {
                    if (start !== index) result += string.substring(start, index);
                    index2 = string.indexOf("}", index + 2);
                    callId = string.substring(index + 2, index2);
                    result += this._resolveCallSpec(params[callId], contextManager);
                    start = index2 + 1;
                    if (start < string.length) {
                        index = string.indexOf("${", index2);
                    } else {
                        index = -1;
                    }
                }
                if (start < string.length) {
                    result += string.substring(start);
                }
                return result;
            } else {
                console.error("not supported yet " + callSpec);
            }
        } else if (callObject === "patient") {
            //"getData": [ {"object": "patient", "method": "getAge"}]
            let args = callSpec["args"] || [];

            args = args.map((arg) => {
                if (arg === "$selectedValue") {
                    return selectedValue;
                }
                return arg;
            });

            result = contextManager.getPatient()[callSpec["method"]](...args);
            if (Lang.isArray(result)) {
                if (!Lang.isUndefined(callSpec["itemKey"])) {
                    const itemKey = callSpec["itemKey"].split(".");
                    const itemContext = callSpec["itemContext"].split(".");
                    const dateLabel = callSpec["dateLabel"];
                    return result.map((item) => {
                        return {
                            key: this._getValueUsingPath(item, itemKey),
                            context: this._getValueUsingPath(item, itemContext),
                            object: item,
                            date: item[dateLabel]
                        };
                    });
                }
                // NOTE: We left this in in case we needed to add the listItems functionality back into shortcuts.json
                // At the time of commenting we had modified the only instances of this 'getData' format from Shortcuts.json, @all medications' and '@active medications'
                // else {
                //     let listItems = callSpec["listItems"];
                //     listItems = listItems.map((listItem) => {
                //         return listItem.split(".");
                //     });
                //     const numMedications = result.length - 1;
                //     const numListItems = listItems.length - 1;
                //     let strResult = "";
                //     result.forEach((item, itemIndex) => {
                //         listItems.forEach((itemKey, attrIndex) => {
                //             let nextSubstring = this._getValueUsingPath(item, itemKey);
                //             if (!Lang.isUndefined(nextSubstring) && !Lang.isNull(nextSubstring)) strResult += nextSubstring;
                //             if (attrIndex < numListItems) strResult += " ";
                //         });
                //         if (itemIndex < numMedications) {
                //             strResult += "\r\n";
                //         }
                //     });
                //     result = strResult;
                // }
            }
            return result;
        } else if (callObject === "parent") {
            //   "getData": {"object": "parent", "attribute": "stage"},
            const attribute = callSpec["attribute"];
            if (this.parentContext) {
                const attributeValue = this.parentContext.getAttributeValue(attribute);
                if (attributeValue) return attributeValue;
            }
        } else if (callObject === "$parentValueObject") {
            const patient = contextManager.getPatient();
            if (!this.parentContext || !this.parentContext.getValueObject()) {
                // Returns text if the parent context is not set.
                return this.getText();
            }
            return this.parentContext.getValueObject()[callSpec["method"]](patient);
        } else {
            console.error("not support yet " + callSpec.object + " / " + callSpec.method);
        }
        return null;
    }

    /*
     * Determines the text to display for this particular inserter shortcut. Some shortcuts
     * will return a string value, but others can returns a list of possible options for the
     * user to select from. Each item in that list must be a javascript object like this:
     *   {  key: <identifier for item>,
     context: <label or title to display to user>,
     object: <full SHR data object represented>
     }
     */
    determineText(contextManager) {
        const callSpec = this.metadata["getData"];
        return this._resolveCallSpec(callSpec, contextManager);
    }

    getShortcutType() {
        return this.metadata["id"];
    }

    isContext() {
        return this.metadata.isContext && !this._shouldRemoveFromContext;
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text;
    }

    setOriginalText(text) {
        this.originalText = text;
    }

    getOriginalText() {
        return this.originalText;
    }

    serialize(displayText) {
        // TODO: Refactor to no longer need displayText as a parameter. This variable should only use this.text.
        let text = displayText || this.text; // Use provided text to override shortcut text
        if (Lang.isNull(text)) {
            text = this.initiatingTrigger;
        } else if (typeof text === "string" && text.startsWith(this.getPrefixCharacter())) {
            // NOTE: This should only happen when the inserter shortcut is incomplete; we want that serialization to reflect the incompleteness
            if (text === this.initiatingTrigger) {
                return text;
            }
            text = text.substring(1);
        }
        // If this.valueObject exists, put the entryId of the valueObject in the result text
        if (this.valueObject) {
            const shortcutDataObj = {
                text,
                entryId: this.valueObject.entryInfo.entryId.id,
                wasRemovedFromContext: this.wasRemovedFromContext,
                originalText: this.originalText,
            };
            return `${this.initiatingTrigger}[[${JSON.stringify(shortcutDataObj)}]]`;
        }

        return `${this.initiatingTrigger}[[${text}]]`;
    }

    getDisplayText() {
        return Lang.isNull(this.text) ? this.initiatingTrigger : this.text;
    }

    createObjectForParsing(selectedValue, contextManager) {
        const callSpec = this.metadata["createObjectForParsing"];

        const object = this._resolveCallSpec(callSpec, contextManager, selectedValue);

        return object;
    }

    setWasRemovedFromContext(value) {
        this.wasRemovedFromContext = value;
    }

    setValueObject(valueObject) {
        this.valueObject = valueObject;
        const parentAttribute = this.metadata["parentAttribute"];

        // Check parent of shortcut and setAttributeValue
        if (parentAttribute && this.parentContext instanceof CreatorBase && this.parentContext.isAttributeSupported(parentAttribute)) {
            this.parentContext.setAttributeValue(parentAttribute, this.valueObject);
        }
    }

    isGlobalContext() {
        const isGlobalContext = this.metadata["isGlobalContext"];
        return Lang.isUndefined(isGlobalContext) ? false : isGlobalContext;
    }

    onBeforeDeleted() {
        const result = super.onBeforeDeleted();
        if (result && !Lang.isUndefined(this.parentContext) && this.metadata.parentAttribute) {
            this.parentContext.setAttributeValue(this.metadata.parentAttribute, null, false);
            this.parentContext.removeChild(this);
        } else if (result && !Lang.isUndefined(this.parentContext)) {
            this.parentContext.removeChild(this);
        }
        return result;
    }

    get isComplete() {
        return Lang.toLower(this.getDisplayText()) !== Lang.toLower(this.metadata.stringTriggers[0].name);
    }
}
