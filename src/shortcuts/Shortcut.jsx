import Context from '../context/Context';
import _ from 'lodash';
import moment from 'moment';
import { v4 } from 'uuid';


class Shortcut extends Context {
    constructor() {
        super();
        if (this.constructor === Shortcut) {
            throw new TypeError("Cannot construct Shortcut instances directly");
        }
        this.optionsToSelectFrom = null;
        this.valueChangeHandlers = {};
        this.uniqueId = v4();
    }

    initialize(contextManager, trigger = undefined, updatePatient = true) {
        super.initialize(contextManager, trigger, updatePatient);
    }

    onBeforeDeleted() {
        if (this.isContext() && this.hasChildren()) {
            this.children.forEach(c => c.removeParent());
        }
        if (this.isContext() && this.contextManager) {
            this.contextManager.removeShortcutFromContext(this);
        }
        return true;
    }

    setConfiguration(config) {
        this.configuration = config;
    }

    // by default shortcuts are not Contexts.
    isContext() {
        return false;
    }

    /**
     * By default will throw an error, should be implemented by classes that inherits Shortcut
     * @returns The text to be displayed by other components in the app
     */
    getDisplayText() {
        throw new Error(`getDisplayText not implemented for ${this.constructor.name}`);
    }

    /**
     * By default will throw an error, should be implemented by classes that inherits Shortcut
     * @returns The selected value for the shortcut
     */
    getText() {
        throw new Error(`getText not implemented for ${this.constructor.name}`);
    }

    getId() {
        return this.metadata["id"];
    }

    getPrefixCharacter() {
        throw new TypeError("Primitive shortcut has no prefix character");
    }

    getShortcutType() {
        throw new TypeError("Base Shortcut has no type");
    }

    setSource(source) {
        this._source = source;
    }

    getSource() {
        return this._source;
    }

    // Slim App
    getAsString () {
        return "#null";
    }

    clearValueSelectionOptions() {
        this.optionsToSelectFrom = null;
    }

    getValueSelectionOptions() {
        return this.optionsToSelectFrom;
    }

    //options is array of {key: item.entryId.id, context: item.specificType.coding[0].displayText, object: item, date: item.<name of the object that holds the date. Varies for each shortcut>}
    flagForTextSelection(options) {
        // Sort the options by time if options is an array
        if (_.isArray(options)) {
            options.sort(this._optionsTimeSorter);
        }
        this.optionsToSelectFrom = options;
    }

    needToSelectValueFromMultipleOptions() {
        return !_.isNull(this.optionsToSelectFrom);
    }

    /**
     * @returns text string to be saved in note
     */
    serialize() {
        return this.getText();
    }

    updatePatient(patient, contextManager) {
        throw new Error("update patient not implemented for " + this.constructor.name);
    }

    validateInCurrentContext(contextManager) {
        return []; // no errors
    }

    // Sorts array items by time with most recent item first
    _optionsTimeSorter(a, b) {
        const a_startTime = new moment(a.date, "D MMM YYYY");
        const b_startTime = new moment(b.date, "D MMM YYYY");

        if (a_startTime < b_startTime) {
            return 1;
        }
        if (a_startTime > b_startTime) {
            return -1;
        }
        return 0;
    }

    /**
     * figure out parent context for this shortcut. Use following:
     * (1) use known parent context if attribute exists
     * (2) use parent with correct parent attribute
     * (3) leave parentContext undefined
     */
    determineParentContext(contextManager, knownParent, parentAttribute) {
        if (knownParent) {
            this.parentContext = contextManager.getActiveContextOfType(knownParent);
        } else {
            // Find parent with correct parent attribute
            if (parentAttribute) {
                this.parentContext = contextManager.getActiveContexts().find(c => c.isAttributeSupported(parentAttribute));
            }
        }
    }

    hasChildren() {
        return this.children.length > 0;
    }

    hasParentContext() {
        return !_.isEmpty(this.parentContext);
    }

    hasValueObjectAttributes() {
        return !_.isEmpty(this.valueObjectAttributes);
    }

    setAttributeIsSetByLabel(name, val) {
        if (this.hasParentContext()) this.parentContext.setAttributeIsSetByLabel(name, val);
    }

    get isComplete() {
        return true;
    }

    get completionComponentName() {
        return this.metadata.subtype;
    }
}

export default Shortcut;
