// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.Signature.
 */
class Signature {

  /**
   * Get the SignatureType array.
   * @returns {Array<SignatureType>} The shr.core.SignatureType array
   */
  get signatureType() {
    return this._signatureType;
  }

  /**
   * Set the SignatureType array.
   * This field/value is required.
   * @param {Array<SignatureType>} signatureType - The shr.core.SignatureType array
   */
  set signatureType(signatureType) {
    this._signatureType = signatureType;
  }

  /**
   * Set the SignatureType array and return 'this' for chaining.
   * This field/value is required.
   * @param {Array<SignatureType>} signatureType - The shr.core.SignatureType array
   * @returns {Signature} this.
   */
  withSignatureType(signatureType) {
    this.signatureType = signatureType; return this;
  }

  /**
   * Get the CreationDateTime.
   * @returns {CreationDateTime} The shr.core.CreationDateTime
   */
  get creationDateTime() {
    return this._creationDateTime;
  }

  /**
   * Set the CreationDateTime.
   * This field/value is required.
   * @param {CreationDateTime} creationDateTime - The shr.core.CreationDateTime
   */
  set creationDateTime(creationDateTime) {
    this._creationDateTime = creationDateTime;
  }

  /**
   * Set the CreationDateTime and return 'this' for chaining.
   * This field/value is required.
   * @param {CreationDateTime} creationDateTime - The shr.core.CreationDateTime
   * @returns {Signature} this.
   */
  withCreationDateTime(creationDateTime) {
    this.creationDateTime = creationDateTime; return this;
  }

  /**
   * Get the Signatory.
   * @returns {Signatory} The shr.core.Signatory
   */
  get signatory() {
    return this._signatory;
  }

  /**
   * Set the Signatory.
   * This field/value is required.
   * @param {Signatory} signatory - The shr.core.Signatory
   */
  set signatory(signatory) {
    this._signatory = signatory;
  }

  /**
   * Set the Signatory and return 'this' for chaining.
   * This field/value is required.
   * @param {Signatory} signatory - The shr.core.Signatory
   * @returns {Signature} this.
   */
  withSignatory(signatory) {
    this.signatory = signatory; return this;
  }

  /**
   * Get the OnBehalfOf.
   * @returns {OnBehalfOf} The shr.core.OnBehalfOf
   */
  get onBehalfOf() {
    return this._onBehalfOf;
  }

  /**
   * Set the OnBehalfOf.
   * @param {OnBehalfOf} onBehalfOf - The shr.core.OnBehalfOf
   */
  set onBehalfOf(onBehalfOf) {
    this._onBehalfOf = onBehalfOf;
  }

  /**
   * Set the OnBehalfOf and return 'this' for chaining.
   * @param {OnBehalfOf} onBehalfOf - The shr.core.OnBehalfOf
   * @returns {Signature} this.
   */
  withOnBehalfOf(onBehalfOf) {
    this.onBehalfOf = onBehalfOf; return this;
  }

  /**
   * Get the ContentType.
   * @returns {ContentType} The shr.core.ContentType
   */
  get contentType() {
    return this._contentType;
  }

  /**
   * Set the ContentType.
   * This field/value is required.
   * @param {ContentType} contentType - The shr.core.ContentType
   */
  set contentType(contentType) {
    this._contentType = contentType;
  }

  /**
   * Set the ContentType and return 'this' for chaining.
   * This field/value is required.
   * @param {ContentType} contentType - The shr.core.ContentType
   * @returns {Signature} this.
   */
  withContentType(contentType) {
    this.contentType = contentType; return this;
  }

  /**
   * Get the BinaryData.
   * @returns {BinaryData} The shr.core.BinaryData
   */
  get binaryData() {
    return this._binaryData;
  }

  /**
   * Set the BinaryData.
   * This field/value is required.
   * @param {BinaryData} binaryData - The shr.core.BinaryData
   */
  set binaryData(binaryData) {
    this._binaryData = binaryData;
  }

  /**
   * Set the BinaryData and return 'this' for chaining.
   * This field/value is required.
   * @param {BinaryData} binaryData - The shr.core.BinaryData
   * @returns {Signature} this.
   */
  withBinaryData(binaryData) {
    this.binaryData = binaryData; return this;
  }

  /**
   * Deserializes JSON data to an instance of the Signature class.
   * The JSON must be valid against the Signature JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {Signature} An instance of Signature populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'Signature');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the Signature class to a JSON object.
   * The JSON is expected to be valid against the Signature JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/Signature' } };
    if (this.signatureType != null) {
      inst['SignatureType'] = this.signatureType.map(f => f.toJSON());
    }
    if (this.creationDateTime != null) {
      inst['CreationDateTime'] = typeof this.creationDateTime.toJSON === 'function' ? this.creationDateTime.toJSON() : this.creationDateTime;
    }
    if (this.signatory != null) {
      inst['Signatory'] = typeof this.signatory.toJSON === 'function' ? this.signatory.toJSON() : this.signatory;
    }
    if (this.onBehalfOf != null) {
      inst['OnBehalfOf'] = typeof this.onBehalfOf.toJSON === 'function' ? this.onBehalfOf.toJSON() : this.onBehalfOf;
    }
    if (this.contentType != null) {
      inst['ContentType'] = typeof this.contentType.toJSON === 'function' ? this.contentType.toJSON() : this.contentType;
    }
    if (this.binaryData != null) {
      inst['BinaryData'] = typeof this.binaryData.toJSON === 'function' ? this.binaryData.toJSON() : this.binaryData;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the Signature class.
   * The FHIR must be valid against the Signature FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {Signature} An instance of Signature populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'Signature');
    const inst = new klass();
    for (const fhir_extension of fhir['extension'] || []) {
      if (fhir_extension['url'] != null && fhir_extension['url'] === 'http://hl7.org/fhir/us/shr/DSTU2/StructureDefinition/shr-core-OnBehalfOf-extension') {
        inst.onBehalfOf = FHIRHelper.createInstanceFromFHIR('shr.core.OnBehalfOf', fhir_extension, 'Extension', shrId, allEntries, mappedResources, referencesOut, true);
      }
    }
    for (const fhir_type of fhir['type'] || []) {
      inst.signatureType = inst.signatureType || [];
      const inst_signatureType = FHIRHelper.createInstanceFromFHIR('shr.core.SignatureType', fhir_type, 'Coding', shrId, allEntries, mappedResources, referencesOut, false);
      inst.signatureType.push(inst_signatureType);
    }
    if (fhir['when'] != null) {
      inst.creationDateTime = FHIRHelper.createInstanceFromFHIR('shr.core.CreationDateTime', fhir['when'], 'instant', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['whoUri'] != null) {
      inst.signatory = FHIRHelper.createInstanceFromFHIR('shr.core.Signatory', fhir['whoUri'], 'uri', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['contentType'] != null) {
      inst.contentType = FHIRHelper.createInstanceFromFHIR('shr.core.ContentType', fhir['contentType'], 'code', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['blob'] != null) {
      inst.binaryData = FHIRHelper.createInstanceFromFHIR('shr.core.BinaryData', fhir['blob'], 'base64Binary', shrId, allEntries, mappedResources, referencesOut, false);
    }
    return inst;
  }

}
export default Signature;
