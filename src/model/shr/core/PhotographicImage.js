// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

import Attachment from './Attachment';

/**
 * Generated class for shr.core.PhotographicImage.
 * @extends Attachment
 */
class PhotographicImage extends Attachment {

  /**
   * Deserializes JSON data to an instance of the PhotographicImage class.
   * The JSON must be valid against the PhotographicImage JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {PhotographicImage} An instance of PhotographicImage populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'PhotographicImage');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the PhotographicImage class to a JSON object.
   * The JSON is expected to be valid against the PhotographicImage JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/PhotographicImage' } };
    if (this.binaryData != null) {
      inst['BinaryData'] = typeof this.binaryData.toJSON === 'function' ? this.binaryData.toJSON() : this.binaryData;
    }
    if (this.contentType != null) {
      inst['ContentType'] = typeof this.contentType.toJSON === 'function' ? this.contentType.toJSON() : this.contentType;
    }
    if (this.language != null) {
      inst['Language'] = typeof this.language.toJSON === 'function' ? this.language.toJSON() : this.language;
    }
    if (this.resourceLocation != null) {
      inst['ResourceLocation'] = typeof this.resourceLocation.toJSON === 'function' ? this.resourceLocation.toJSON() : this.resourceLocation;
    }
    if (this.resourceSize != null) {
      inst['ResourceSize'] = typeof this.resourceSize.toJSON === 'function' ? this.resourceSize.toJSON() : this.resourceSize;
    }
    if (this.hash != null) {
      inst['Hash'] = typeof this.hash.toJSON === 'function' ? this.hash.toJSON() : this.hash;
    }
    if (this.title != null) {
      inst['Title'] = typeof this.title.toJSON === 'function' ? this.title.toJSON() : this.title;
    }
    if (this.creationDateTime != null) {
      inst['CreationDateTime'] = typeof this.creationDateTime.toJSON === 'function' ? this.creationDateTime.toJSON() : this.creationDateTime;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the PhotographicImage class.
   * The FHIR must be valid against the PhotographicImage FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {PhotographicImage} An instance of PhotographicImage populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'PhotographicImage');
    const inst = new klass();
    if (fhir['contentType'] != null) {
      inst.contentType = FHIRHelper.createInstanceFromFHIR('shr.core.ContentType', fhir['contentType'], 'code', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['language'] != null) {
      inst.language = FHIRHelper.createInstanceFromFHIR('shr.core.Language', fhir['language'], 'code', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['data'] != null) {
      inst.binaryData = FHIRHelper.createInstanceFromFHIR('shr.core.BinaryData', fhir['data'], 'base64Binary', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['url'] != null) {
      inst.resourceLocation = FHIRHelper.createInstanceFromFHIR('shr.core.ResourceLocation', fhir['url'], 'uri', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['size'] != null) {
      inst.resourceSize = FHIRHelper.createInstanceFromFHIR('shr.core.ResourceSize', fhir['size'], 'unsignedInt', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['hash'] != null) {
      inst.hash = FHIRHelper.createInstanceFromFHIR('shr.core.Hash', fhir['hash'], 'base64Binary', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['title'] != null) {
      inst.title = FHIRHelper.createInstanceFromFHIR('shr.core.Title', fhir['title'], 'string', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['creation'] != null) {
      inst.creationDateTime = FHIRHelper.createInstanceFromFHIR('shr.core.CreationDateTime', fhir['creation'], 'dateTime', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (asExtension) {
      inst.value = fhir['valueAttachment'];
    }
    return inst;
  }

}
export default PhotographicImage;
