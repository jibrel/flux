import MetadataSection from "./MetadataSection";
import Lang from 'lodash';

export default class VitalsSubsection extends MetadataSection {
    getVitalsForSubsection = (patient, currentConditionEntry, subsection) => {
        if (Lang.isNull(patient) || Lang.isNull(currentConditionEntry)) return [];
        return patient.entries
            .filter(e => e.codeableConceptCode === subsection.code) // Get Flux entries that match the subsection vital
            .map(v => {
                let processedVital = {};
                processedVital["start_time"] = v.clinicallyRelevantTime;
                processedVital[subsection.name] = v.quantity.number;
                processedVital["unit"] = v.quantity.unit;

                return processedVital
            });
    }
}