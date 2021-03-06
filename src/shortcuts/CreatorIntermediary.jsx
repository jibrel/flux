import Shortcut from './Shortcut';
import _ from 'lodash';

export default class CreatorIntermediary extends Shortcut {
    constructor(onUpdate, metadata) {
        super();
        this.metadata = metadata;
        this.text = "#" + this.metadata["name"];

        // get attribute descriptions
        this.onUpdate = onUpdate;
        this.setAttributeValue = this.setAttributeValue.bind(this);
    }

    initialize(contextManager, trigger = undefined, updatePatient = true) {
        super.initialize(contextManager, trigger, updatePatient);

        if (_.isUndefined(this.parentContext)) {
            super.determineParentContext(contextManager, this.metadata["knownParentContexts"], this.metadata["parentAttribute"]);
        }

        if (!_.isUndefined(this.parentContext) && this.parentContext.children.indexOf(this) === -1) {
            this.parentContext.setAttributeValue(this.metadata["parentAttribute"], true, false, updatePatient);
            this.parentContext.addChild(this);
        }
    }

    isContext() {
        return this.metadata.isContext;
    }

    shouldBeInContext() {
        const voaList = this.metadata["valueObjectAttributes"];
        let isSet, result = false;
        voaList.forEach((voa) => {
            isSet = this.getAttributeIsSet(voa.name);
            if (!isSet) {
                result = true;
                return;
            }
        });
        return result;
    }

    getShortcutType() {
        return this.metadata["id"];
    }

    onBeforeDeleted() {
        const result = super.onBeforeDeleted();

        if (this.parentContext) {
            this.parentContext.setAttributeValue(this.metadata["parentAttribute"], false, false);
            this.parentContext.removeChild(this);
        }

        return result;
    }

    getAttributeIsSet(name) {
        const voaList = this.metadata["valueObjectAttributes"];
        const result = voaList.filter(function (item) {
            return item.name === name;
        });
        if (result && result[0]) {
            if (this.parentContext) return this.parentContext.getAttributeIsSet(result[0].toParentAttribute);
        } else {
            throw new Error("Unknown attribute " + name + " on " + this.metadata["id"]);
        }
    }

    getAttributeValue(name) {
        const voaList = this.metadata["valueObjectAttributes"];
        const result = voaList.filter(function (item) {
            return item.name === name;
        });
        if (result && result[0]) {
            if (this.parentContext) return this.parentContext.getAttributeValue(result[0].toParentAttribute);
        } else {
            throw new Error("Unknown attribute " + name + " on " + this.metadata["id"]);
        }
    }

    isAttributeSupported(name) {
        const voaList = this.metadata["valueObjectAttributes"];
        const result = voaList.filter(function (item) {
            return item.name === name;
        });
        return (result && result[0]);
    }

    setAttributeValue(name, value, publishChanges = true, updatePatient = true) {
        const voaList = this.metadata["valueObjectAttributes"];
        const result = voaList.filter(function (item) {
            return item.name === name;
        });
        if (result && result[0]) {
            if (this.parentContext) this.parentContext.setAttributeValue(result[0].toParentAttribute, value, publishChanges, updatePatient);
            if (this.isContext()) this.updateContextStatus();
        } else {
            throw new Error("Unknown attribute " + name + " on " + this.metadata["id"]);
        }
    }

    serialize() {
        return this.initiatingTrigger;
    }

    getDisplayText() {
        return this.initiatingTrigger.replace('#', '');
    }

    getPrefixCharacter() {
        return "#";
    }

    hasValueObjectAttributes() {
        return !_.isEmpty(this.metadata["valueObjectAttributes"]);
    }

    get isComplete() {
        return this.hasParentContext() && this.hasChildren();
    }

    get isMissingParent() {
        return !this.hasParentContext();
    }
    get potentialParents() {
        const knownParent = this.metadata["knownParentContexts"];
        if (knownParent === 'Patient' || knownParent === undefined) return [];
        if (_.isArray(knownParent)) {
            return knownParent;
        } else if (_.isString(knownParent)) {
            return [knownParent];
        } else {
            console.warn("unknown type for knownParent: element looks like ", knownParent);
            return [];
        }
    }
}
