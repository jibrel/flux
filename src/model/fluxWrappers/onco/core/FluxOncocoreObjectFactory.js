import { getNamespaceAndName } from '../../../json-helper';
import FluxCancerCondition from './FluxCancerCondition';
import FluxEvidenceType from './FluxEvidenceType';
import FluxCancerHistologicGrade from './FluxCancerHistologicGrade';
import FluxCancerHistologicType from '../../oncocore/FluxCancerHistologicType';
import FluxTNMClinicalStageGroup from './FluxTNMClinicalStageGroup';
import FluxTNMPathologicStageGroup from './FluxTNMPathologicStageGroup';
import FluxCancerDiseaseStatus from './FluxCancerDiseaseStatus';
import FluxTNMClinicalPrimaryTumorCategory from './FluxTNMClinicalPrimaryTumorCategory';
import FluxTNMClinicalDistantMetastasesCategory from './FluxTNMClinicalDistantMetastasesCategory';
import FluxTNMClinicalRegionalNodesCategory from './FluxTNMClinicalRegionalNodesCategory';
import FluxTumorMarkerTest from './FluxTumorMarkerTest';
import OncoCoreObjectFactory from '../../../onco/core/OncoCoreObjectFactory';
import FluxTumorDimensions from '../../tumor/FluxTumorDimensions';
import FluxGeneticMutationTestResult from './FluxGeneticMutationTestResult';
import FluxGenomicsReport from './FluxGenomicsReport';

export default class FluxOncocoreObjectFactory {
    static createInstance(json, type, patientRecord) {
        const { namespace, elementName } = getNamespaceAndName(json, type);
        if (namespace !== 'onco.core') {
            throw new Error(`Unsupported type in OncocoreObjectFactory: ${type}`);
        }
        // returns Flux wrapper class if found, otherwise use OncocoreObjectFactory
        switch (elementName) {
            case 'CancerDiseaseStatus': return new FluxCancerDiseaseStatus(json, type, patientRecord);
            case 'CancerCondition': return new FluxCancerCondition(json, type, patientRecord);
            // TODO: does this need to be reviewed?
            case 'PrimaryCancerCondition': return new FluxCancerCondition(json, type, patientRecord);
            case 'SecondaryCancerCondition': return new FluxCancerCondition(json, type, patientRecord);
            case 'CancerHistologicGrade': return new FluxCancerHistologicGrade(json, type, patientRecord);
            case 'CancerHistologicType': return new FluxCancerHistologicType(json, type, patientRecord);
            case 'GeneticMutationTestResult': return new FluxGeneticMutationTestResult(json);
            case 'GenomicsReport': return new FluxGenomicsReport(json, patientRecord);
            case 'TumorDimensions': return new FluxTumorDimensions(json);
            case 'TumorMarkerTest': return new FluxTumorMarkerTest(json);
            case 'TNMClinicalStageGroup': return new FluxTNMClinicalStageGroup(json, patientRecord);
            case 'TNMPathologicStageGroup': return new FluxTNMPathologicStageGroup(json, patientRecord);
            case 'TNMClinicalPrimaryTumorCategory': return new FluxTNMClinicalPrimaryTumorCategory(json);
            case 'TNMClinicalDistantMetastasesCategory': return new FluxTNMClinicalDistantMetastasesCategory(json);
            case 'TNMClinicalRegionalNodesCategory': return new FluxTNMClinicalRegionalNodesCategory(json);
            case 'EvidenceType': return new FluxEvidenceType(json, type, patientRecord);
            default: return OncoCoreObjectFactory.createInstance(json, type, patientRecord);
        }
    }
}
