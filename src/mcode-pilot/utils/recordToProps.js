import _ from 'lodash';
import FluxTumorDimensions from '../../model/fluxWrappers/tumor/FluxTumorDimensions';
import FluxTNMClinicalPrimaryTumorCategory from '../../model/fluxWrappers/onco/core/FluxTNMClinicalPrimaryTumorCategory';
import FluxTNMClinicalRegionalNodesCategory from '../../model/fluxWrappers/onco/core/FluxTNMClinicalRegionalNodesCategory';
import FluxTNMClinicalDistantMetastasesCategory from '../../model/fluxWrappers/onco/core/FluxTNMClinicalDistantMetastasesCategory';

export default function getProps(patient, condition, filters) {
    const tumorMarkers = patient.getMostRecentTumorMarkers(condition);
    let tnminfo;
    const clinStage = condition.getMostRecentClinicalStaging();
    if (clinStage
        && clinStage._tnmStageGroup
        && clinStage._tnmStageGroup._panelMembers
        && clinStage._tnmStageGroup._panelMembers.observation) {
        tnminfo = processPanel(clinStage._tnmStageGroup._panelMembers.observation, patient);
    }
    const propDict = {
        // demographics
        "demographic": {
            "age": {
                "display": "age",
                "mcodeElement": "shr.core.DateOfBirth", // note the implied calculation required here
                "valueType": "range",
                "range": 10,
                "value": patient.getAge(),
                "unit": "years"
            },
            "diagnosedAge": {
                "display": "age at diagnosis",
                "mcodeElement": "shr.core.DateOfDiagnosis", // note the implied calculation required here as well
                "valueType": "range",
                "range": 10,
                "value": patient.getAgeAsOf(new Date(condition.diagnosisDate)),
                "unit": "years"
            },
            "race": {
                "display": "race",
                "mcodeElement": "shr.core.Race",
                "valueType": "string",
                "value": patient.patient.race
            },
            "gender": {
                "display": "gender",
                "mcodeElement": "shr.core.BirthSex",
                "valueType": "string",
                "value": _.lowerCase(patient.patient.gender)
            }
        },
        // pathology
        "pathology": {
            "grade": {
                "display": "grade",
                "mcodeElement": "onco.core.CancerHistologicGrade", // note: not part of mCODE 0.9 IG but it is part of the defined spec
                "valueType": "int",
                "value": (() => {
                    const grade = condition.getMostRecentHistologicalGrade();
                    if (!grade) return null;
                    return grade.getGradeAsSimpleNumber();
                })(),
                "reference": condition.getMostRecentHistologicalGrade()
            },
            "clinical_stage": {
                "display": "stage",
                "mcodeElement": "onco.core.TNMClinicalStageGroup",
                // NOTE: the section is titled pathology but all the fields referenced in it are clinical, not pathologic
                // (all sample data in the fixtures is clinical staging)
                "valueType": "string",
                "value": _safeGet(condition.getMostRecentClinicalStaging(), "stage"),
                "reference": condition.getMostRecentClinicalStaging()
            },
            "pathologic_stage": {
                "display": "stage",
                "mcodeElement": "onco.core.TNMPathologicStageGroup",
                "valueType": "string",
                "value": _safeGet(condition.getMostRecentPathologicStaging(), "stage"),
                "reference": condition.getMostRecentPathologicStaging()
            },
            "t_stage": {
                "display": "primary tumor",
                "mcodeElement": "onco.core.TNMClinicalPrimaryTumorCategory",
                "valueType": "string",
                "value": _safeGet(condition.getMostRecentClinicalStaging(),"t_Stage"),
                "reference": _safeGet(tnminfo,"t")
            },
            "n_stage": {
                "display": "regional lymph nodes",
                "mcodeElement": "onco.core.TNMClinicalRegionalNodesCategory",
                "valueType": "string",
                "value": _safeGet(condition.getMostRecentClinicalStaging(),"n_Stage"),
                "reference": _safeGet(tnminfo,"n")
            },
            "m_stage": {
                "display": "distant metastasis",
                "mcodeElement": "onco.core.TNMClinicalDistantMetastasesCategory",
                "valueType": "string",
                "value": _safeGet(condition.getMostRecentClinicalStaging(),"m_Stage"),
                "reference": _safeGet(tnminfo,"m")
            },
            "size": {
                "display": "size (mm)",
                "mcodeElement": "onco.core.TumorDimensions", // note: not part of mCODE 0.9 IG but it is part of the defined spec
                "valueType": "int",
                "value": (() => {
                    const quantity = _safeGet(_safeGet(condition.getObservationsOfTypeChronologicalOrder(FluxTumorDimensions), 0),'quantity');
                    return _safeGet(quantity, "number");
                })(),
                "reference": condition.getMostRecentLabResultOfEachType().find(e => { return e.constructor.name === FluxTumorDimensions.name; })
            }
        },
        "medical history": {
            "ECOG": {
                "display": "ECOG Score",
                "mcodeElement": "shr.core.ECOGPerformanceStatus",
                "valueType": "range",
                "range": 1,
                "value": _safeGet(condition.getMostRecentECOGPerformanceStatus(), "value"),
                "reference": condition.getMostRecentECOGPerformanceStatus()
            }
        }
    };

    if (tumorMarkers) {
        tumorMarkers.forEach((e) => {
            if (!e.receptorType) return;
            propDict.pathology[e.receptorType.split(' ').join('')] = {
                "display": e.receptorType,
                "mcodeElement": "onco.core.TumorMarkerTest",
                "valueType": "string",
                "value": _.lowerCase(e.status),
                "reference": e
            };
        });
    }

    if (propDict.pathology.pathologic_stage.value) {
        delete propDict.pathology.clinical_stage;
    }

    return _mapProp(propDict, filters);
}

function _safeGet(object, property) {
    if (object !== null & object !== undefined && property in object) {
        return object[property];
    } else {
        return object;
    }
}

function processPanel(panelMembers, patient) {
    const returnJson = {};
    panelMembers.forEach((e) => {
        const entry = patient.getEntryById(e._entryId);
        if (entry instanceof FluxTNMClinicalPrimaryTumorCategory) {
            returnJson.t = entry._cancerStageCategory.dataValue.value.coding[0];
        } else if (entry instanceof FluxTNMClinicalRegionalNodesCategory) {
            returnJson.n = entry._cancerStageCategory.dataValue.value.coding[0];
        } else if (entry instanceof FluxTNMClinicalDistantMetastasesCategory) {
            returnJson.m = entry._cancerStageCategory.dataValue.value.coding[0];
        }
    });
    return returnJson;
}

function checkFilter(filters, option) {
    const isValueEmpty = option.value !== null && option.value !== undefined;
    if (filters !== undefined) {
        // there are filters in the config, make sure the current option is in the list
        return filters.includes(option.mcodeElement) && isValueEmpty;
    } else {
        // no filter list supplied, assume all filters are active
        return isValueEmpty;
    }
}
// a map of similar patient props to the patient record
function _mapProp(propDict, filters) {
    const similarPatientProps = {};
    // categories
    for (const key of Object.keys(propDict)) {
        const potentialCategory = {
            options: {},
            selected: false,
            displayText: key
        };
        // values
        for (const prop of Object.keys(propDict[key])) {
            const option = propDict[key][prop];
            // drops option boxes that don't have
            // a value from the patient record
            if (checkFilter(filters, option)) {
                const propEntry = {
                    selected: false,
                    displayText: option.display
                };

                if (option.reference) {
                    propEntry.reference = option.reference;
                }
                if (option.mcodeElement) {
                    propEntry.mcodeElement = option.mcodeElement;
                }

                if (option.unit) {
                    propEntry.unit = option.unit;
                }

                if (option.valueType === "range") {
                    propEntry.minValue = (option.value >= option.range) ? option.value - option.range : 0;
                    propEntry.maxValue = option.value + option.range;
                    propEntry.defaultMinValue = (option.value >= option.range) ? option.value - option.range : 0;
                    propEntry.defaultMaxValue = option.value + option.range;
                }

                propEntry.value = option.value;

                potentialCategory.options[prop] = propEntry;
            }
        }
        if (Object.keys(potentialCategory.options).length > 0) {
            similarPatientProps[key] = potentialCategory;
        }
    }
    return similarPatientProps;
}
