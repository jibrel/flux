import MetadataSection from "./MetadataSection";
import FluxTumorDimensions from '../../model/fluxWrappers/tumor/FluxTumorDimensions';
import FluxTumorMargins from '../../model/fluxWrappers/tumor/FluxTumorMargins';
import _ from 'lodash';
import FluxCancerCondition from "../../model/fluxWrappers/onco/core/FluxCancerCondition";

export default class PathologySection extends MetadataSection {
    getMetadata(preferencesManager, patient, condition, roleType, role, specialty) {
        const metadata = {
            name: "Pathology",
            shortName: "Pathology",
            type: "NameValuePairs",
            /*eslint no-template-curly-in-string: "off"*/
            narrative: [
                {
                    defaultTemplate: "Date of pathology report is ${.Report Date}. Pathologist is ${.Pathologist}."
                },
                {
                    defaultTemplate: "Primary tumor color is ${.Color}, weight is ${.Weight}, and size is ${.Size}."
                },
                {
                    defaultTemplate: "Tumor margins are ${.Tumor Margins}. Histological grade is ${.Histological Grade}."
                }

            ],
            data: [
                {
                    name: "",
                    items: [

                        // TODO: When return value for items that are currently null, need to also return patient.isUnsigned(currentConditionEntry)
                        {
                            name: "Report Date",
                            value: (patient, currentConditionEntry) => {
                                const list = patient.getPathologyReportsChronologicalOrder();
                                if (list.length === 0) return null;
                                const report = list.pop();

                                return  {  value: report.relevantTime,
                                    isUnsigned: patient.isUnsigned(report),
                                    source: this.determineSource(patient, report)
                                };
                            }
                        },
                        {
                            name: "Pathologist",
                            value: (patient, currentConditionEntry) => {
                                const list = patient.getPathologyReportsChronologicalOrder();
                                if (list.length === 0) return null;
                                const report = list.pop();

                                return  {  value: report.author,
                                    isUnsigned: patient.isUnsigned(report),
                                    source: this.determineSource(patient, report)
                                };
                            }
                        },
                        {
                            name: "Color",
                            value: null
                        },
                        {
                            name: "Weight",
                            value: null
                        },
                        {
                            name: "Size",
                            value: (patient, currentConditionEntry) => {
                                const list = currentConditionEntry.getObservationsOfTypeChronologicalOrder(FluxTumorDimensions);
                                if (list.length === 0) return null;
                                const size = list.pop(); // last is most recent
                                return  {   value: size.quantity.number + " " + size.quantity.unit,
                                    isUnsigned: patient.isUnsigned(size),
                                    source: this.determineSource(patient, size)
                                };
                            }
                        },
                        {
                            name: "Tumor Margins",
                            value: (patient, currentConditionEntry) => {
                                const list = currentConditionEntry.getObservationsOfTypeChronologicalOrder(FluxTumorMargins);
                                if (list.length === 0) return null;
                                const margins = list.pop(); // last is most recent
                                return  {   value: margins.value,
                                    isUnsigned: patient.isUnsigned(margins),
                                    source: this.determineSource(patient, margins)
                                };
                            }
                        },
                        {
                            name: "Histological Grade",
                            value: (patient, currentConditionEntry) => {
                                const histologicalGrade = currentConditionEntry.getMostRecentHistologicalGrade();
                                if (_.isNull(histologicalGrade)) return null;

                                return  {
                                    value: histologicalGrade.grade,
                                    isUnsigned: patient.isUnsigned(histologicalGrade),
                                    source: this.determineSource(patient, histologicalGrade)
                                };
                            }
                        },
                    ]
                }
            ]
        };

        // Include receptor statuses for Breast Cancer metadata
        if (condition instanceof FluxCancerCondition && condition.isCancerType('Invasive ductal carcinoma of breast')) {
            metadata.narrative.push({
                defaultTemplate: "ER-${.Receptor Status ER} PR-${.Receptor Status PR} HER2-${.Receptor Status HER2}."
            });
            metadata.data[0].items.push(
                {
                    name: "Receptor Status ER",
                    value: (patient, currentConditionEntry) => {
                        const er = currentConditionEntry.getMostRecentERReceptorStatus();
                        if (_.isNull(er)) {
                            return null;
                        } else {
                            return  {   value: er.status,
                                isUnsigned: patient.isUnsigned(er),
                                source: this.determineSource(patient, er)
                            };
                        }
                    }
                },
                {
                    name: "Receptor Status PR",
                    value: (patient, currentConditionEntry) => {
                        const pr = currentConditionEntry.getMostRecentPRReceptorStatus();
                        if (_.isNull(pr)) {
                            return null;
                        } else {
                            return  {   value: pr.status,
                                isUnsigned: patient.isUnsigned(pr),
                                source: this.determineSource(patient, pr)
                            };
                        }
                    }
                },
                {
                    name: "Receptor Status HER2",
                    value: (patient, currentConditionEntry) => {
                        const her2 = currentConditionEntry.getMostRecentHER2ReceptorStatus();
                        if (_.isNull(her2)) {
                            return null;
                        } else {
                            return  {   value: her2.status,
                                isUnsigned: patient.isUnsigned(her2),
                                source: this.determineSource(patient, her2)
                            };
                        }
                    }
                }
            );
        }

        return metadata;
    }
}
