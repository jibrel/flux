import '../model/init';
import NewPatientOnlyDataSource from './NewPatientOnlyDataSource';
import RestApiDataSource from './RestApiDataSource';
import FHIRApiDataSource from './FHIRApiDataSource';
import McodeV09SmartOnFhirDataSource from './McodeV09SmartOnFhirDataSource';
import GenericSmartOnFhirDstu2DataSource from './GenericSmartOnFhirDstu2DataSource';
import HardcodedTabletMcodeV09DataSource from './HardcodedTabletMcodeV09DataSource';
import HardCodedMcodeV09DataSource from './HardCodedMcodeV09DataSource';

export default class DataAccess {
    static DEMO_PATIENT_ID = "788dcbc3-ed18-470c-89ef-35ff91854c7d";

    constructor(dataSourceName, dataSourceProps) {
        if (dataSourceName === 'NewPatientOnlyDataSource') {
            this.dataSource = new NewPatientOnlyDataSource();
        } else if (dataSourceName === 'RestApiDataSource') {
            this.dataSource = new RestApiDataSource();
        } else if (dataSourceName === 'FHIRApiDataSource') {
            this.dataSource = new FHIRApiDataSource();
        } else if (dataSourceName === 'HardCodedMcodeV09DataSource') {
            this.dataSource = new HardCodedMcodeV09DataSource();
        } else if (dataSourceName === 'McodeV09SmartOnFhirDataSource') {
            this.dataSource = new McodeV09SmartOnFhirDataSource(dataSourceProps);
        } else if (dataSourceName === 'GenericSmartOnFhirDstu2DataSource') {
            this.dataSource = new GenericSmartOnFhirDstu2DataSource(dataSourceProps);
        } else if (dataSourceName === 'HardcodedTabletMcodeV09DataSource') {
            this.dataSource = new HardcodedTabletMcodeV09DataSource();
        } else {
            throw new Error("Unrecognized data source class name: " + dataSourceName);
        }
    }

    getPatient(id, callback) {
        return this.dataSource.getPatient(id, callback);
    }

    getListOfPatients() {
        return this.dataSource.getListOfPatients();
    }

    newPatient() {
        return this.dataSource.newPatient();
    }

    savePatient(patient) {
        return this.dataSource.savePatient(patient);
    }

    getGestalt() {
        return this.dataSource.getGestalt();
    }
}
