import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TreatmentOptionsOutcomesTable from '../TreatmentOptionsOutcomesTable/TreatmentOptionsOutcomesTable';
import TreatmentOptionsOutcomesIcons from '../TreatmentOptionsOutcomesIcons/TreatmentOptionsOutcomesIcons';
import './TreatmentOptionsOutcomes.css';

export default class TreatmentOptionsOutcomes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            outcomesToggle: 'table',
            timescaleToggle: '',
            sortColumn: '',
            sortDirection: 0
        };
    }

    componentDidMount() {
        this.handleChangeSort('totalPatients');
    }

    handleToggleTimescale = (time) => {
        this.setState({ timescaleToggle: time });
    }

    handleToggleOutcomes = () => {
        this.setState({ outcomesToggle: this.state.outcomesToggle === "table" ? "icons" : "table" });
    }

    handleChangeSort = column => {
        const { sortColumn, sortDirection } = this.state;

        // sort direction is represented by a 0 (no sorting), 1 (ascending), or 2 (descending)
        if (column === sortColumn) {
            this.setState({
                sortDirection: (sortDirection + 1) % 3
            });
        } else {
            this.setState({
                sortColumn: column,
                sortDirection: 1 // reset to 1 when a different column is clicked
            });
        }
    }

    treatmentCompare(propName) {
        if (propName === 'totalPatients') {
            // sort by number of patients, no need to get ratio
            return function(a,b) {
                return b[propName] - a[propName];
            };
        } else {
            return function(a,b) {
                const aRatio = a.survivorsPerYear[propName] ? a.survivorsPerYear[propName] / a['totalPatients'] : 0;
                const bRatio = b.survivorsPerYear[propName] ? b.survivorsPerYear[propName] / b['totalPatients'] : 0;
                return bRatio - aRatio;
            };
        }
    }

    alphabeticalCompare(a, b) {
        const displayA = a.displayName;
        const displayB = b.displayName;
        if (displayA < displayB) return -1;
        if (displayA > displayB) return 1;
        return 0;
    }

    renderTableIcon() {
        return (
            <svg height="20" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.75 0.75H15.25V15.25H0.75V0.75Z" strokeWidth="1.5" />
                <path d="M8 0.5V15.5" strokeWidth="1.5" />
                <path d="M0.5 8H15.5" strokeWidth="1.5" />
            </svg>
        );
    }

    renderIconsIcon() {
        return (
            <svg height="20" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.97674 5.67948L6.07668 10.25H0.75V0.75H15.25V4.91309H6.72656H5.95998L5.97674 5.67948Z"
                    strokeWidth="1.5" />
                <path
                    d="M9.02326 12.3205L8.92332 7.75H15.25V16.25H0.75V13.0869H8.27344H9.04002L9.02326 12.3205Z"
                    strokeWidth="1.5" />
            </svg>
        );
    }

    renderToggleButtons = () => {
        let { timescaleToggle } = this.state;
        const { outcomesToggle } = this.state;
        const { timescale } = this.props;

        if (timescaleToggle==='') {
            timescaleToggle = timescale[0];
        }

        return (
            <div className="treatment-options-outcomes__toggle">
                <div className="timescale-toggles">
                    {outcomesToggle === "icons" && timescale.map((time, i) =>
                        <div
                            className={`timescale-toggle ${timescaleToggle === time ? 'active' : ''}`}
                            onClick={() => this.handleToggleTimescale(time)}
                            key={i}>
                            {time} yr
                        </div>)
                    }
                </div>

                <div
                    className={`toggle-icon table-toggle ${outcomesToggle === "table" ? "active" : ""}`}
                    onClick={() => this.handleToggleOutcomes()}>
                    {this.renderTableIcon()}
                    <div className="toggle-text">table</div>
                </div>

                <div
                    className={`toggle-icon icons-toggle ${outcomesToggle === "icons" ? "active" : ""}`}
                    onClick={() => this.handleToggleOutcomes()}>
                    {this.renderIconsIcon()}
                    <div className="toggle-text">icons</div>
                </div>
            </div>
        );
    }

    render() {
        const {
            selectedSideEffects,
            selectedTreatment,
            setSelectedSideEffects,
            setSelectedTreatment,
            showSideEffects,
            sideEffects,
            similarPatientTreatments,
            similarPatientTreatmentsData,
            timescale
        } = this.props;
        const { outcomesToggle, timescaleToggle, sortDirection, sortColumn } = this.state;

        if (sortDirection) { // it could be ascending or descending, but it's sorted
            similarPatientTreatmentsData.sort(this.treatmentCompare(sortColumn));
            if (sortDirection === 2) { // descending
                similarPatientTreatmentsData.reverse();
            }
        } else {
            similarPatientTreatmentsData.sort(this.alphabeticalCompare);
        }

        return (
            <div className="treatment-options-outcomes">
                {this.renderToggleButtons()}

                {outcomesToggle === "table" ?
                    <TreatmentOptionsOutcomesTable
                        changeSort={this.handleChangeSort}
                        selectedSideEffects={selectedSideEffects}
                        selectedTreatment={selectedTreatment}
                        setSelectedSideEffects={setSelectedSideEffects}
                        setSelectedTreatment={setSelectedTreatment}
                        showSideEffects={showSideEffects}
                        sideEffects={sideEffects}
                        similarPatientTreatments={similarPatientTreatments}
                        similarPatientTreatmentsData={similarPatientTreatmentsData}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        timescale={timescale}
                    />
                    :
                    <TreatmentOptionsOutcomesIcons
                        selectedTreatment={selectedTreatment}
                        setSelectedTreatment={setSelectedTreatment}
                        similarPatientTreatmentsData={similarPatientTreatmentsData}
                        timescale={timescale}
                        timescaleToggle={timescaleToggle !== '' ? timescaleToggle : timescale[0]}
                    />
                }
            </div>
        );
    }
}

TreatmentOptionsOutcomes.propTypes = {
    selectedSideEffects: PropTypes.string.isRequired,
    selectedTreatment: PropTypes.object,
    setSelectedSideEffects: PropTypes.func.isRequired,
    setSelectedTreatment: PropTypes.func.isRequired,
    showSideEffects: PropTypes.bool.isRequired,
    sideEffects: PropTypes.array.isRequired,
    similarPatientTreatments: PropTypes.array.isRequired,
    similarPatientTreatmentsData: PropTypes.array.isRequired,
    timescale: PropTypes.array.isRequired
};
