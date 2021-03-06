// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.Coding.
 */
class Coding {

  /**
   * Get the CodeValue.
   * @returns {CodeValue} The shr.core.CodeValue
   */
  get codeValue() {
    return this._codeValue;
  }

  /**
   * Set the CodeValue.
   * @param {CodeValue} codeValue - The shr.core.CodeValue
   */
  set codeValue(codeValue) {
    this._codeValue = codeValue;
  }

  /**
   * Set the CodeValue and return 'this' for chaining.
   * @param {CodeValue} codeValue - The shr.core.CodeValue
   * @returns {Coding} this.
   */
  withCodeValue(codeValue) {
    this.codeValue = codeValue; return this;
  }

  /**
   * Get the CodeSystem.
   * @returns {CodeSystem} The shr.core.CodeSystem
   */
  get codeSystem() {
    return this._codeSystem;
  }

  /**
   * Set the CodeSystem.
   * @param {CodeSystem} codeSystem - The shr.core.CodeSystem
   */
  set codeSystem(codeSystem) {
    this._codeSystem = codeSystem;
  }

  /**
   * Set the CodeSystem and return 'this' for chaining.
   * @param {CodeSystem} codeSystem - The shr.core.CodeSystem
   * @returns {Coding} this.
   */
  withCodeSystem(codeSystem) {
    this.codeSystem = codeSystem; return this;
  }

  /**
   * Get the CodeSystemVersion.
   * @returns {CodeSystemVersion} The shr.core.CodeSystemVersion
   */
  get codeSystemVersion() {
    return this._codeSystemVersion;
  }

  /**
   * Set the CodeSystemVersion.
   * @param {CodeSystemVersion} codeSystemVersion - The shr.core.CodeSystemVersion
   */
  set codeSystemVersion(codeSystemVersion) {
    this._codeSystemVersion = codeSystemVersion;
  }

  /**
   * Set the CodeSystemVersion and return 'this' for chaining.
   * @param {CodeSystemVersion} codeSystemVersion - The shr.core.CodeSystemVersion
   * @returns {Coding} this.
   */
  withCodeSystemVersion(codeSystemVersion) {
    this.codeSystemVersion = codeSystemVersion; return this;
  }

  /**
   * Get the DisplayText.
   * @returns {DisplayText} The shr.core.DisplayText
   */
  get displayText() {
    return this._displayText;
  }

  /**
   * Set the DisplayText.
   * @param {DisplayText} displayText - The shr.core.DisplayText
   */
  set displayText(displayText) {
    this._displayText = displayText;
  }

  /**
   * Set the DisplayText and return 'this' for chaining.
   * @param {DisplayText} displayText - The shr.core.DisplayText
   * @returns {Coding} this.
   */
  withDisplayText(displayText) {
    this.displayText = displayText; return this;
  }

  /**
   * Deserializes JSON data to an instance of the Coding class.
   * The JSON must be valid against the Coding JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {Coding} An instance of Coding populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'Coding');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the Coding class to a JSON object.
   * The JSON is expected to be valid against the Coding JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/Coding' } };
    if (this.codeValue != null) {
      inst['CodeValue'] = typeof this.codeValue.toJSON === 'function' ? this.codeValue.toJSON() : this.codeValue;
    }
    if (this.codeSystem != null) {
      inst['CodeSystem'] = typeof this.codeSystem.toJSON === 'function' ? this.codeSystem.toJSON() : this.codeSystem;
    }
    if (this.codeSystemVersion != null) {
      inst['CodeSystemVersion'] = typeof this.codeSystemVersion.toJSON === 'function' ? this.codeSystemVersion.toJSON() : this.codeSystemVersion;
    }
    if (this.displayText != null) {
      inst['DisplayText'] = typeof this.displayText.toJSON === 'function' ? this.displayText.toJSON() : this.displayText;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the Coding class.
   * The FHIR must be valid against the Coding FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {Coding} An instance of Coding populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'Coding');
    const inst = new klass();
    if (fhir['system'] != null) {
      inst.codeSystem = FHIRHelper.createInstanceFromFHIR('shr.core.CodeSystem', fhir['system'], 'uri', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['version'] != null) {
      inst.codeSystemVersion = FHIRHelper.createInstanceFromFHIR('shr.core.CodeSystemVersion', fhir['version'], 'string', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['code'] != null) {
      inst.codeValue = FHIRHelper.createInstanceFromFHIR('shr.core.CodeValue', fhir['code'], 'code', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['display'] != null) {
      inst.displayText = FHIRHelper.createInstanceFromFHIR('shr.core.DisplayText', fhir['display'], 'string', shrId, allEntries, mappedResources, referencesOut, false);
    }
    return inst;
  }

}
export default Coding;
