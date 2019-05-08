import Entry from '../shr/base/Entry';
import EntryType from '../shr/base/EntryType';
import CreationTime from '../shr/core/CreationTime';
import LastUpdated from '../shr/base/LastUpdated';
import Reference from '../Reference';
import moment from 'moment';
import Lang from 'lodash';

class FluxClinicalNote {
    constructor(json) {
        this._entryInfo = new Entry();
        this._entryInfo.shrId = json['ShrId'];
        this._entryInfo.entryId = json['EntryId'];
        this._entryInfo.entryType = new EntryType();
        this._entryInfo.entryType.value = "http://standardhealthrecord.org/spec/shr/core/ClinicalNote";
        let today = new moment().format("D MMM YYYY");
        this._entryInfo.creationTime = new CreationTime();
        this._entryInfo.creationTime.dateTime = today;
        this._entryInfo.lastUpdated = new LastUpdated();
        this._entryInfo.lastUpdated.instant = today;
        if (json.signedOn) this._signedOn = json.signedOn;
        if (json.subject) this._subject = json.subject;
        if (json.hospital) this._hospital = json.hospital;
        if (json.createdBy) this._createdBy = json.createdBy;
        if (json.signedBy) this._signedBy = json.signedBy;
        if (json.CreationTime) this._entryInfo.creationTime = json.CreationTime;
        // Ensures even empty strings result in content definition
        if (json.content || json.content === "") this._content = json.content;
        if (!Lang.isUndefined(json.signed)) this._signed = json.signed;
        if (json.DocumentedEncounter) {
            const { _ShrId, _EntryId, _EntryType } = json.DocumentedEncounter;
            this._documentedEncounter = new Reference(_ShrId, _EntryId, _EntryType);
        }
    }

    /**
     * Getter for entry information (shr.base.Entry)
     */
    get entryInfo() {
        return this._entryInfo;
    }

    /**
     * Setter for entry information (shr.base.Entry)
     */
    set entryInfo(entryVal) {
        this._entryInfo = entryVal;
    }

    get metadata() {
        return this._metadata;
    }

    set metadata(metadata) {
        this._metadata = metadata;
    }
    
    get signedOn() {
        return this._signedOn;
    }

    set signedOn(val) {
        this._signedOn = val;
    }

    get createdOn() {
        return this._entryInfo.creationTime.value;
    }

    get signedBy() {
        return this._signedBy;
    }

    set signedBy(val) {
        this._signedBy = val;
    }

    get subject() {
        return this._subject;
    }

    set subject(val) {
        this._subject = val;
    }

    get hospital() {
        return this._hospital;
    }

    set hospital(val) {
        this._hospital = val;
    }

    get createdBy() {
        return this._createdBy;
    }

    set createdBy(val) {
        this._createdBy = val;
    }

    get content() {
        return this._content;
    }

    set content(val) {
        this._content = val;
    }
    
    get signed() {
        return this._signed;
    }
    
    set signed(val) {
        this._signed = val;
    }

    // returns documented encounter reference
    get documentedEncounter() {
        return this._documentedEncounter;
    }

    // sets documented encounter reference
    set documentedEncounter(encounter) {
        this._documentedEncounter = encounter;
    }

    toJSON() {
        const clinicalNoteJSON = {
            ShrId: this.entryInfo.shrId,
            EntryId: this.entryInfo.entryId,
            EntryType: this.entryInfo.entryType,
            PersonOfRecord: this.entryInfo.personOfRecord,
            signedOn: this.signedOn,
            signedBy: this.signedBy,
            subject: this.subject,
            hospital: this.hospital,
            createdBy: this.createdBy,
            content: this.content,
            CreationTime: this.entryInfo.creationTime,
            LastUpdated: this.entryInfo.lastUpdated,
            signed: this.signed,
        };

        if (this._documentedEncounter) clinicalNoteJSON.DocumentedEncounter = this._documentedEncounter.toJSON();

        return clinicalNoteJSON;
    }
}

export default FluxClinicalNote;
