// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.Brand.
 */
class Brand {

  /**
   * Get the IsBrand.
   * @returns {IsBrand} The shr.core.IsBrand
   */
  get isBrand() {
    return this._isBrand;
  }

  /**
   * Set the IsBrand.
   * This field/value is required.
   * @param {IsBrand} isBrand - The shr.core.IsBrand
   */
  set isBrand(isBrand) {
    this._isBrand = isBrand;
  }

  /**
   * Set the IsBrand and return 'this' for chaining.
   * This field/value is required.
   * @param {IsBrand} isBrand - The shr.core.IsBrand
   * @returns {Brand} this.
   */
  withIsBrand(isBrand) {
    this.isBrand = isBrand; return this;
  }

  /**
   * Get the BrandName.
   * @returns {BrandName} The shr.core.BrandName
   */
  get brandName() {
    return this._brandName;
  }

  /**
   * Set the BrandName.
   * @param {BrandName} brandName - The shr.core.BrandName
   */
  set brandName(brandName) {
    this._brandName = brandName;
  }

  /**
   * Set the BrandName and return 'this' for chaining.
   * @param {BrandName} brandName - The shr.core.BrandName
   * @returns {Brand} this.
   */
  withBrandName(brandName) {
    this.brandName = brandName; return this;
  }

  /**
   * Deserializes JSON data to an instance of the Brand class.
   * The JSON must be valid against the Brand JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {Brand} An instance of Brand populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'Brand');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the Brand class to a JSON object.
   * The JSON is expected to be valid against the Brand JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/Brand' } };
    if (this.isBrand != null) {
      inst['IsBrand'] = typeof this.isBrand.toJSON === 'function' ? this.isBrand.toJSON() : this.isBrand;
    }
    if (this.brandName != null) {
      inst['BrandName'] = typeof this.brandName.toJSON === 'function' ? this.brandName.toJSON() : this.brandName;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the Brand class.
   * The FHIR must be valid against the Brand FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {Brand} An instance of Brand populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'Brand');
    const inst = new klass();
    return inst;
  }

}
export default Brand;
