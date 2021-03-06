import MedicationCodeOrReference from '../shr/core/MedicationCodeOrReference';
import { FHIRHelper, uuid } from '../json-helper'; 

/**
 * This fix class replaces the shr.core.MedicationCodeOrReferenceFix.fromFHIR function with a version that handles various different FHIR types correctly.
 
 * See this bug for more information: https://github.com/standardhealth/shr-es6-export/issues/35
 */ 
export default class MedicationCodeOrReferenceFix extends MedicationCodeOrReference {

  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const inst = new MedicationCodeOrReferenceFix();
    if (!asExtension && fhir != null) {
      // reminder: MedicationCodeOrReference.value can be: (CodeableConcept|Reference)

      switch(fhirType) {
        case 'CodeableConcept':
          inst.value = FHIRHelper.createInstanceFromFHIR('shr.core.CodeableConcept', fhir, 'CodeableConcept', shrId, allEntries, mappedResources, referencesOut);
          break;

        case 'Reference':
          const entryId = fhir['reference'];
          if (!mappedResources[entryId]) {
            const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
            if (referencedEntry) {
              mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR(null, referencedEntry['resource'], null, shrId, allEntries, mappedResources, referencesOut);
            }
          }
          inst.value = FHIRHelper.createReference(mappedResources[entryId], referencesOut);
          break;

        default:
          // do nothing
      }
    }

    return inst;
  }
}