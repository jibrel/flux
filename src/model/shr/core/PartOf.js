// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.PartOf.
 */
class PartOf {

  /**
   * Get the value (aliases domainResource).
   * @returns {Reference} The shr.core.DomainResource reference
   */
  get value() {
    return this._domainResource;
  }

  /**
   * Set the value (aliases domainResource).
   * This field/value is required.
   * @param {Reference} value - The shr.core.DomainResource reference
   */
  set value(value) {
    this._domainResource = value;
  }

  /**
   * Set the value (aliases domainResource) and return 'this' for chaining.
   * This field/value is required.
   * @param {Reference} value - The shr.core.DomainResource reference
   * @returns {PartOf} this.
   */
  withValue(value) {
    this.value = value; return this;
  }

  /**
   * Get the shr.core.DomainResource reference.
   * @returns {Reference} The shr.core.DomainResource reference
   */
  get domainResource() {
    return this._domainResource;
  }

  /**
   * Set the shr.core.DomainResource reference.
   * This field/value is required.
   * @param {Reference} domainResource - The shr.core.DomainResource reference
   */
  set domainResource(domainResource) {
    this._domainResource = domainResource;
  }

  /**
   * Set the shr.core.DomainResource reference and return 'this' for chaining.
   * This field/value is required.
   * @param {Reference} domainResource - The shr.core.DomainResource reference
   * @returns {PartOf} this.
   */
  withDomainResource(domainResource) {
    this.domainResource = domainResource; return this;
  }

  /**
   * Deserializes JSON data to an instance of the PartOf class.
   * The JSON must be valid against the PartOf JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {PartOf} An instance of PartOf populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'PartOf');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the PartOf class to a JSON object.
   * The JSON is expected to be valid against the PartOf JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/PartOf' } };
    if (this.value != null) {
      inst['Value'] = typeof this.value.toJSON === 'function' ? this.value.toJSON() : this.value;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the PartOf class.
   * The FHIR must be valid against the PartOf FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {PartOf} An instance of PartOf populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'PartOf');
    const inst = new klass();
    if (asExtension) {
      inst.value = fhir['valueReference'];
    }
    if (!asExtension && fhir != null) {
      inst.value = FHIRHelper.createInstanceFromFHIR('shr.core.DomainResource', fhir, fhirType, shrId, allEntries, mappedResources, referencesOut);
    }
    return inst;
  }

}
export default PartOf;
