import BaseIndexer from './BaseIndexer';

class MedicationsIndexer extends BaseIndexer {
    indexData(section, subsection, data, searchIndex) {
        super.indexData(section, subsection, data, searchIndex);
        data.forEach(item => {
            searchIndex.addSearchableData({
                section,
                subsection: "",
                valueTitle: `${item.medication.medication} Dosage`,
                value: `${item.medication.amountPerDose.value} ${item.medication.amountPerDose.units}`
            });

            searchIndex.addSearchableData({
                section,
                subsection: "",
                valueTitle: "Medication",
                value: item.medication.medication
            });

            searchIndex.addSearchableData({
                section,
                subsection: "",
                valueTitle: `${item.medication.medication} Timing`,
                value: item.medication.timingOfDoses.value
            });

            searchIndex.addSearchableData({
                section,
                subsection: "",
                valueTitle: `${item.medication.medication} Prescribed`,
                value: item.medication.whenPrescribed
            });

            searchIndex.addSearchableData({
                section,
                subsection: "",
                valueTitle: `${item.medication.medication} Route`,
                value: item.medication.routeIntoBody
            });

            searchIndex.addSearchableData({
                section,
                subsection: "",
                valueTitle: `${item.medication.medication} Prescribed By`,
                value: item.medication.prescribedBy
            });
        });
    }
}

export default MedicationsIndexer;