import { getNamespaceAndName } from '../json-helper';
import ShrCoreObjectFactory from '../shr/core/ShrCoreObjectFactory';
import FluxClinicalNote from './FluxClinicalNote';
import FluxKarnofskyPerformanceStatus from './FluxKarnofskyPerformanceStatus';
import FluxProcedureRequest from './FluxProcedureRequest';
import FluxProcedure from './FluxProcedure';
import FluxImagingProcedure from './FluxImagingProcedure';
import FluxBloodPressure from '../vital/FluxBloodPressure';
import FluxBodyTemperature from './FluxBodyTemperature';
import FluxBodyWeight from './FluxBodyWeight';
import FluxHeartRate from './FluxHeartRate';

export default class FluxCoreObjectFactory {
    static createInstance(json, type) {
        const { namespace, elementName } = getNamespaceAndName(json, type);
        if (namespace !== 'shr.core') {
            throw new Error(`Unsupported type in ShrCoreObjectFactory: ${type}`);
        }
        // returns Flux wrapper class if found, otherwise use ShrCoreObjectFactory
        switch (elementName) {
            case 'BloodPressure': return new FluxBloodPressure(json);
            case 'BodyTemperature': return new FluxBodyTemperature(json);
            case 'BodyWeight': return new FluxBodyWeight(json);
            case 'ClinicalNote': return new FluxClinicalNote(json);
            case 'HeartRate': return new FluxHeartRate(json);
            case 'ImagingProcedure': return new FluxImagingProcedure(json);
            case 'KarnofskyPerformanceStatus': return new FluxKarnofskyPerformanceStatus(json);
            case 'Procedure': return new FluxProcedure(json);
            case 'ProcedureRequest': return new FluxProcedureRequest(json);
            default: return ShrCoreObjectFactory.createInstance(json, type);
        }
    }
}