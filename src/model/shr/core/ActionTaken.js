// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

/**
 * Generated class for shr.core.ActionTaken.
 */
class ActionTaken {

  /**
   * Get the CommentOrDescription.
   * @returns {CommentOrDescription} The shr.core.CommentOrDescription
   */
  get commentOrDescription() {
    return this._commentOrDescription;
  }

  /**
   * Set the CommentOrDescription.
   * This field/value is required.
   * @param {CommentOrDescription} commentOrDescription - The shr.core.CommentOrDescription
   */
  set commentOrDescription(commentOrDescription) {
    this._commentOrDescription = commentOrDescription;
  }

  /**
   * Set the CommentOrDescription and return 'this' for chaining.
   * This field/value is required.
   * @param {CommentOrDescription} commentOrDescription - The shr.core.CommentOrDescription
   * @returns {ActionTaken} this.
   */
  withCommentOrDescription(commentOrDescription) {
    this.commentOrDescription = commentOrDescription; return this;
  }

  /**
   * Get the shr.core.ActionStatement reference.
   * @returns {Reference} The shr.core.ActionStatement reference
   */
  get actionStatement() {
    return this._actionStatement;
  }

  /**
   * Set the shr.core.ActionStatement reference.
   * @param {Reference} actionStatement - The shr.core.ActionStatement reference
   */
  set actionStatement(actionStatement) {
    this._actionStatement = actionStatement;
  }

  /**
   * Set the shr.core.ActionStatement reference and return 'this' for chaining.
   * @param {Reference} actionStatement - The shr.core.ActionStatement reference
   * @returns {ActionTaken} this.
   */
  withActionStatement(actionStatement) {
    this.actionStatement = actionStatement; return this;
  }

  /**
   * Deserializes JSON data to an instance of the ActionTaken class.
   * The JSON must be valid against the ActionTaken JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {ActionTaken} An instance of ActionTaken populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('shr.core', 'ActionTaken');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the ActionTaken class to a JSON object.
   * The JSON is expected to be valid against the ActionTaken JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/shr/core/ActionTaken' } };
    if (this.commentOrDescription != null) {
      inst['CommentOrDescription'] = typeof this.commentOrDescription.toJSON === 'function' ? this.commentOrDescription.toJSON() : this.commentOrDescription;
    }
    if (this.actionStatement != null) {
      inst['ActionStatement'] = typeof this.actionStatement.toJSON === 'function' ? this.actionStatement.toJSON() : this.actionStatement;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the ActionTaken class.
   * The FHIR must be valid against the ActionTaken FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {ActionTaken} An instance of ActionTaken populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('shr.core', 'ActionTaken');
    const inst = new klass();
    if (asExtension) {
      const match_3 = fhir['extension'].find(e => e.url == 'http://hl7.org/fhir/us/shr/DSTU2/StructureDefinition/shr-core-CommentOrDescription-extension');
      if (match_3 != null) {
        inst.commentOrDescription = FHIRHelper.createInstanceFromFHIR('shr.core.CommentOrDescription', match_3, 'Extension', shrId, allEntries, mappedResources, referencesOut, true);
      }
      const match_4 = fhir['extension'].find(e => e.url == 'http://hl7.org/fhir/us/shr/DSTU2/StructureDefinition/shr-core-ActionStatement-extension');
      if (match_4 != null) {
        inst.actionStatement = FHIRHelper.createInstanceFromFHIR('shr.core.ActionStatement', match_4, 'Extension', shrId, allEntries, mappedResources, referencesOut, true);
      }
    }
    return inst;
  }

}
export default ActionTaken;
