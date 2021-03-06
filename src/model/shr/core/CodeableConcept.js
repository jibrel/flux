// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.CodeableConcept.
 */
class CodeableConcept {

  /**
   * Get the Coding array.
   * @returns {Array<Coding>} The shr.core.Coding array
   */
  get coding() {
    return this._coding;
  }

  /**
   * Set the Coding array.
   * @param {Array<Coding>} coding - The shr.core.Coding array
   */
  set coding(coding) {
    this._coding = coding;
  }

  /**
   * Set the Coding array and return 'this' for chaining.
   * @param {Array<Coding>} coding - The shr.core.Coding array
   * @returns {CodeableConcept} this.
   */
  withCoding(coding) {
    this.coding = coding; return this;
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
   * @returns {CodeableConcept} this.
   */
  withDisplayText(displayText) {
    this.displayText = displayText; return this;
  }

  /**
   * Deserializes JSON data to an instance of the CodeableConcept class.
   * The JSON must be valid against the CodeableConcept JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {CodeableConcept} An instance of CodeableConcept populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'CodeableConcept');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the CodeableConcept class to a JSON object.
   * The JSON is expected to be valid against the CodeableConcept JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/CodeableConcept' } };
    if (this.coding != null) {
      inst['Coding'] = this.coding.map(f => f.toJSON());
    }
    if (this.displayText != null) {
      inst['DisplayText'] = typeof this.displayText.toJSON === 'function' ? this.displayText.toJSON() : this.displayText;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the CodeableConcept class.
   * The FHIR must be valid against the CodeableConcept FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {CodeableConcept} An instance of CodeableConcept populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'CodeableConcept');
    const inst = new klass();
    for (const fhir_coding of fhir['coding'] || []) {
      inst.coding = inst.coding || [];
      const inst_coding = FHIRHelper.createInstanceFromFHIR('shr.core.Coding', fhir_coding, 'Coding', shrId, allEntries, mappedResources, referencesOut, false);
      inst.coding.push(inst_coding);
    }
    if (fhir['text'] != null) {
      inst.displayText = FHIRHelper.createInstanceFromFHIR('shr.core.DisplayText', fhir['text'], 'string', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (asExtension) {
      inst.value = fhir['valueCodeableConcept'];
    }
    return inst;
  }

}
export default CodeableConcept;
