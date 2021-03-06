// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.ObservationComponent.
 */
class ObservationComponent {

  /**
   * Get the Code.
   * @returns {Code} The shr.core.Code
   */
  get code() {
    return this._code;
  }

  /**
   * Set the Code.
   * This field/value is required.
   * @param {Code} code - The shr.core.Code
   */
  set code(code) {
    this._code = code;
  }

  /**
   * Set the Code and return 'this' for chaining.
   * This field/value is required.
   * @param {Code} code - The shr.core.Code
   * @returns {ObservationComponent} this.
   */
  withCode(code) {
    this.code = code; return this;
  }

  /**
   * Get the DataValue.
   * @returns {DataValue} The shr.core.DataValue
   */
  get dataValue() {
    return this._dataValue;
  }

  /**
   * Set the DataValue.
   * @param {DataValue} dataValue - The shr.core.DataValue
   */
  set dataValue(dataValue) {
    this._dataValue = dataValue;
  }

  /**
   * Set the DataValue and return 'this' for chaining.
   * @param {DataValue} dataValue - The shr.core.DataValue
   * @returns {ObservationComponent} this.
   */
  withDataValue(dataValue) {
    this.dataValue = dataValue; return this;
  }

  /**
   * Get the DataAbsentReason.
   * @returns {DataAbsentReason} The shr.core.DataAbsentReason
   */
  get dataAbsentReason() {
    return this._dataAbsentReason;
  }

  /**
   * Set the DataAbsentReason.
   * @param {DataAbsentReason} dataAbsentReason - The shr.core.DataAbsentReason
   */
  set dataAbsentReason(dataAbsentReason) {
    this._dataAbsentReason = dataAbsentReason;
  }

  /**
   * Set the DataAbsentReason and return 'this' for chaining.
   * @param {DataAbsentReason} dataAbsentReason - The shr.core.DataAbsentReason
   * @returns {ObservationComponent} this.
   */
  withDataAbsentReason(dataAbsentReason) {
    this.dataAbsentReason = dataAbsentReason; return this;
  }

  /**
   * Get the ReferenceRange.
   * @returns {ReferenceRange} The shr.core.ReferenceRange
   */
  get referenceRange() {
    return this._referenceRange;
  }

  /**
   * Set the ReferenceRange.
   * @param {ReferenceRange} referenceRange - The shr.core.ReferenceRange
   */
  set referenceRange(referenceRange) {
    this._referenceRange = referenceRange;
  }

  /**
   * Set the ReferenceRange and return 'this' for chaining.
   * @param {ReferenceRange} referenceRange - The shr.core.ReferenceRange
   * @returns {ObservationComponent} this.
   */
  withReferenceRange(referenceRange) {
    this.referenceRange = referenceRange; return this;
  }

  /**
   * Get the Interpretation.
   * @returns {Interpretation} The shr.core.Interpretation
   */
  get interpretation() {
    return this._interpretation;
  }

  /**
   * Set the Interpretation.
   * @param {Interpretation} interpretation - The shr.core.Interpretation
   */
  set interpretation(interpretation) {
    this._interpretation = interpretation;
  }

  /**
   * Set the Interpretation and return 'this' for chaining.
   * @param {Interpretation} interpretation - The shr.core.Interpretation
   * @returns {ObservationComponent} this.
   */
  withInterpretation(interpretation) {
    this.interpretation = interpretation; return this;
  }

  /**
   * Deserializes JSON data to an instance of the ObservationComponent class.
   * The JSON must be valid against the ObservationComponent JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {ObservationComponent} An instance of ObservationComponent populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'ObservationComponent');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the ObservationComponent class to a JSON object.
   * The JSON is expected to be valid against the ObservationComponent JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/ObservationComponent' } };
    if (this.code != null) {
      inst['Code'] = typeof this.code.toJSON === 'function' ? this.code.toJSON() : this.code;
    }
    if (this.dataValue != null) {
      inst['DataValue'] = typeof this.dataValue.toJSON === 'function' ? this.dataValue.toJSON() : this.dataValue;
    }
    if (this.dataAbsentReason != null) {
      inst['DataAbsentReason'] = typeof this.dataAbsentReason.toJSON === 'function' ? this.dataAbsentReason.toJSON() : this.dataAbsentReason;
    }
    if (this.referenceRange != null) {
      inst['ReferenceRange'] = typeof this.referenceRange.toJSON === 'function' ? this.referenceRange.toJSON() : this.referenceRange;
    }
    if (this.interpretation != null) {
      inst['Interpretation'] = typeof this.interpretation.toJSON === 'function' ? this.interpretation.toJSON() : this.interpretation;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the ObservationComponent class.
   * The FHIR must be valid against the ObservationComponent FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {ObservationComponent} An instance of ObservationComponent populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'ObservationComponent');
    const inst = new klass();
    return inst;
  }

}
export default ObservationComponent;
