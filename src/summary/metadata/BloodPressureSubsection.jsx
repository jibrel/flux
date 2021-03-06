import VitalsSubsection from './VitalsSubsection';
import Lang from 'lodash';

export default class BloodPressureSubsection extends VitalsSubsection {
    getVitalsForSubsection = (patient, currentConditionEntry, subsection) => {
        if (Lang.isNull(patient) || Lang.isNull(currentConditionEntry)) return [];
        return patient.getVitalByCode("55284-4")
            .map(v => {
                const processedVital = {};
                const [systolic, diastolic] = v.value.split('/');
                processedVital["start_time"] = v.relevantTime;
                processedVital.unit = 'mmHg';
                processedVital["Systolic"] = systolic;
                processedVital["Diastolic"] = diastolic;
                processedVital[subsection.name] = parseInt(systolic, 10); // Scale y-axis based on systolic value (numerator)
                processedVital.series = ["Systolic", "Diastolic"]; // Create two lines for each part of the blood pressure fraction
                processedVital.displayValue = v.value;

                return processedVital;
            });
    }

    getMetadata = (preferencesManager, patient, condition, roleType, role, specialty) => {
        return {
            name: "Blood Pressure",
            code: "55284-4",
            itemsFunction: this.getVitalsForSubsection,
            displayChartLine: false,
            bands: [],
            dots: {
                Systolic: "caret_down",
                Diastolic: "caret_up"
            }
        };
    }
}