import TimePeriod from '../shr/core/TimePeriod';
import ProcedureRequested from '../shr/procedure/ProcedureRequested';

class FluxProcedureRequested {
    constructor(json) {
        this._procedureRequested= ProcedureRequested.fromJSON(json);
    }

    get entryInfo() {
        return this._procedureRequested.entryInfo;
    }

    /*
     *  Getter for occurrenceTime
     *  Can return object containing timePeriodStart and timePeriodEnd value if a range
     *  Returns a date if a single value
     */
    get occurrenceTime() {
        if(this._procedureRequested.actionContext.expectedPerformanceTime.value instanceof TimePeriod) {
            return {
                timePeriodStart: this._procedureRequested.actionContext.expectedPerformanceTime.value.timePeriodStart.value,
                timePeriodEnd: this._procedureRequested.actionContext.expectedPerformanceTime.value.timePeriodEnd.value
            };
        } else {
            return this._procedureRequested.actionContext.expectedPerformanceTime.value;
        }
    }

    /*
     *  Getter for status
     *  Returns status string
     */
    get status() {
        return this._procedureRequested.actionContext.status.value;
    }

    /*
     *  Getter for procedure name
     *  Returns procedure name string
     */
    get name() {
        return this._displayTextOrCode(this._procedureRequested.type.value.coding[0]);
    }

    /*
     *  Getter for reason list for this procedure
     *  Returns array of reasons
     */
    get reasons() {
        return this._procedureRequested.actionContext.reason;
    }
    
    get annotation() {
        if (this._procedureRequested.annotation) {
            return this._procedureRequested.annotation.value;
        } else {
            return null;
        }
    }

    /**
     * Extract a human-readable string from a code.
     *
     * @param {Coding} coding
     * @returns {string} the display text if available, otherwise the code.
     * @private
     */
    _displayTextOrCode(coding) {
        return coding.displayText ? coding.displayText.value : coding.value;
    }
}

export default FluxProcedureRequested;