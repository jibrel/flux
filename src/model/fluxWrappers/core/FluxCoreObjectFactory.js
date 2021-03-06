import { getNamespaceAndName } from '../../json-helper';
import ShrCoreObjectFactory from '../../shr/core/ShrCoreObjectFactory';
import FluxClinicalNote from './FluxClinicalNote';
import FluxCondition from './FluxCondition';
import FluxKarnofskyPerformanceStatus from './FluxKarnofskyPerformanceStatus';
import FluxProcedureRequest from './FluxProcedureRequest';
import FluxProcedure from './FluxProcedure';
import FluxImagingProcedure from './FluxImagingProcedure';
import FluxBloodPressure from './FluxBloodPressure';
import FluxBodyTemperature from './FluxBodyTemperature';
import FluxBodyWeight from './FluxBodyWeight';
import FluxHeartRate from './FluxHeartRate';
import FluxResearchStudy from './FluxResearchStudy';
import FluxResearchSubject from './FluxResearchSubject';
import FluxMedicationRequest from './FluxMedicationRequest';
import FluxAllergyIntolerance from './FluxAllergyIntolerance';
import FluxObservation from './FluxObservation';
import FluxPatient from './FluxPatient';
import FluxEncounter from './FluxEncounter';
import FluxReferralRequest from './FluxReferralRequest';
import FluxMedicationStatement from './FluxMedicationStatement';
import FluxQuestionnaireResponse from './FluxQuestionnaireResponse';
import FluxAdverseDrugReaction from './FluxAdverseDrugReaction';
import FluxDiagnosticReport from './FluxDiagnosticReport';

export default class FluxCoreObjectFactory {
    static createInstance(json, type, patientRecord) {
        const { namespace, elementName } = getNamespaceAndName(json, type);
        if (namespace !== 'shr.core') {
            throw new Error(`Unsupported type in ShrCoreObjectFactory: ${type}`);
        }
        // returns Flux wrapper class if found, otherwise use ShrCoreObjectFactory
        switch (elementName) {
            case 'AdverseDrugReaction': return new FluxAdverseDrugReaction(json, patientRecord);
            case 'AllergyIntolerance': return new FluxAllergyIntolerance(json);
            case 'BloodPressure': return new FluxBloodPressure(json);
            case 'BodyTemperature': return new FluxBodyTemperature(json);
            case 'BodyWeight': return new FluxBodyWeight(json);
            case 'ClinicalNote': return new FluxClinicalNote(json);
            case 'Condition': return new FluxCondition(json, type, patientRecord);
            case 'DiagnosticReport': return new FluxDiagnosticReport(json, patientRecord);
            case 'Encounter': return new FluxEncounter(json);
            case 'HeartRate': return new FluxHeartRate(json);
            case 'ImagingProcedure': return new FluxImagingProcedure(json);
            case 'KarnofskyPerformanceStatus': return new FluxKarnofskyPerformanceStatus(json, type, patientRecord);
            case 'MedicationRequest': return new FluxMedicationRequest(json, patientRecord);
            case 'MedicationStatement': return new FluxMedicationStatement(json, patientRecord);
            case 'Observation': return new FluxObservation(json, type, patientRecord);
            case 'Patient': return new FluxPatient(json, patientRecord);
            case 'Procedure': return new FluxProcedure(json);
            case 'ProcedureRequest': return new FluxProcedureRequest(json, patientRecord);
            case 'QuestionnaireResponse': return new FluxQuestionnaireResponse(json);
            case 'ReferralRequest': return new FluxReferralRequest(json, patientRecord);
            case 'ResearchStudy': return new FluxResearchStudy(json);
            case 'ResearchSubject': return new FluxResearchSubject(json);
            default: return ShrCoreObjectFactory.createInstance(json, type);
        }
    }
}
