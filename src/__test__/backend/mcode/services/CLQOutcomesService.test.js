import {
    expect
} from 'chai';
import _ from 'lodash'
import CLQOutcomesService from '../../../../mcode-pilot/services/outcomes/CLQOutcomesService'
import BreastMainTreatmentDiabetesHypertensionJaneV09 from '../../../../dataaccess/BreastMainTreatmentDiabetesHypertensionJaneV09.json';
import PatientRecord from '../../../../patient/PatientRecord.jsx';
import getProps from '../../../../mcode-pilot/utils/recordToProps';
import FilterOptions from '../../../../mcode-pilot/utils/FilterOptions';
import '../../../../model/init.js';
import expectedFilter from './filter.json';
import response from './response.json';
import rows from './rows.js';
import processed from './processed.js';
import {generateOutcomeData, formatResults} from '../../../../mcode-pilot/utils/serviceResultsProcessing';
const nock = require('nock');
const patientMcode = BreastMainTreatmentDiabetesHypertensionJaneV09;

describe("CLQOutcomesService", () => {
    // this removes the unquie row identifiers for a set of results to allow for testing
    // otherwise the rows are not determinable in advance and tests will fail on not matching 
    // row ids.
    let removeRowIds = (outcomes) => {
        outcomes.similarPatientTreatmentsData.forEach((item) => delete item.id)
    }

    let clqService = new CLQOutcomesService({
        "serviceUrl": "http://localhost/outcomes",
        "timescale": ["1","3","5"]
    });

    let patient = new PatientRecord(patientMcode);
    
    
    let similarPatientProps = getProps(patient, patient.getActiveConditions()[0])
    // select everything in the options 
    _.forIn(similarPatientProps.demographic.options, function (value, key) {
        value.selected = true
    });
    _.forIn(similarPatientProps.pathology.options, function (value, key) {
        value.selected = true
    });

    let filterOptions = new FilterOptions(similarPatientProps);
    let filterValues = filterOptions.getAllActiveValuesByMcodeElement();

    beforeEach(() => {
        nock.disableNetConnect();
    })

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect(); // just to be sure this doesn't break any other tests anywhere else
    });

    it("Should be able to create demographics filter", () => {
        let clqFilter = clqService.buildDemographicsFilter(filterValues);
        expect(_.isEqual(clqFilter, expectedFilter.demographics)).to.be.true
    });

    it("Should be able to create tumormarker filter filter", () => {
        let clqFilter = clqService.buildTumorMarkersFilter(filterValues);
        expect(_.isEqual(clqFilter, expectedFilter.tumorMarkers)).to.be.true
    });

    it("Should be able to create diagnosis filter", () => {
        let clqFilter = clqService.buildDiagnosisFilter(filterValues);
        expect(_.isEqual(clqFilter, expectedFilter.diagnosis)).to.be.true

    });

    it("Should be able to translate results to rows", () => {
        let clqResults = generateOutcomeData(response.outcomes.survival.data)
        expect(_.isEqual(clqResults, rows)).to.be.true
    });

    it("Should be able to process results", () => {
        let clqResults = formatResults(response, [{
            "code": "A",
            "displayName": "A",
            "codeSystem": "2.16.840.1.113883.6.88",
            "codeSystemName": "RXNORM"
        }], [{
                "code": "A",
                "displayName": "A",
                "codeSystem": "2.16.840.1.113883.6.88",
                "codeSystemName": "RXNORM"
            },
            {
                "code": "B",
                "displayName": "B",
                "codeSystem": "2.16.840.1.113883.6.88",
                "codeSystemName": "RXNORM"
            }
        ])
        removeRowIds(clqResults)
        removeRowIds(processed)
        expect(_.isEqual(clqResults, processed)).to.be.true
    });

    it("Should be able to take a request and return results", (done) => {

        const scope = nock('http://localhost/')
            .post('/outcomes')
            .reply(200, response)

        clqService.processSimilarPatientOutcomes(new FilterOptions({})).then((clqResults) => {
            clqResults = formatResults(clqResults);
            removeRowIds(clqResults)
            removeRowIds(processed)
            expect(_.isEqual(clqResults, processed)).to.be.true
            scope.done();
            done();
        }).catch((err) => {
            console.log(err);
            scope.done();
            fail(err);
            done();
        })


    });
});
