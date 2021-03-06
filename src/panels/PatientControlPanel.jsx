import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import Lang from 'lodash';
import PatientSearch from '../patientControl/PatientSearch';
import ConditionSelection from '../summary/ConditionSelection';

import SummaryHeader from '../summary/SummaryHeader';
import './PatientControlPanel.css';

class PatientControlPanel extends Component {
    constructor(props) {
        super(props);
        this.defaultLogoObject = {
            path: 'fluxnotes_logo_color.png',
            altText: 'Flux Notes logo',
            width: '30px',
            height: '40px'
        };

    }

    getLogoObject = () => {
        const { logoObject } = this.props;
        return Object.assign({}, this.defaultLogoObject, logoObject);
    }

    renderFluxNotesLogo = () => {
        const login = (this.props.supportLogin) ? this.props.loginUsername : "";
        const logoObject = this.getLogoObject();
        return (
            <div>
                <img src={logoObject.path} height={logoObject.height} width={logoObject.width} alt={logoObject.altText} />
                <div className="logo-accompaniment">
                    <span className="title"> {this.props.appTitle}</span>
                    <span className="login">{login}</span>
                </div>
            </div>
        );
    }

    // Render the patient-summary information iff we have a patient
    renderSummaryHeader = () => {
        const { patient } = this.props;
        const patientConditions = patient ? patient.getConditions() : [];
        if (Lang.isEmpty(patient)) {
            return;
        } else {
            return (
                <SummaryHeader
                    address={patient.getCurrentHomeAddress()}
                    administrativeSex={patient.getGender()}
                    age={patient.getAge()}
                    clinicalEvent={this.props.clinicalEvent}
                    dataAccess = {this.props.dataAccess}
                    dateOfBirth={patient.getDateOfBirth()}
                    isTablet = {this.props.isTablet}
                    layout={this.props.layout}
                    loadPatient={this.props.loadPatient}
                    mrn={patient.getMRN()}
                    patientConditions={patientConditions}
                    patientName={patient.getName()}
                    photo={patient.getMostRecentPhoto()}
                    possibleClinicalEvents={this.props.possibleClinicalEvents}
                    setCondition={this.props.setCondition}
                    setLayout={this.props.setLayout}
                />
            );
        }
    }

    renderConditionSelectAndSearch = () => {
        const { patient } = this.props;
        const patientConditions = patient ? patient.getConditions() : [];
        const largeAndMediumWidth = this.props.isTablet? 12 : 6;
        if (Lang.isEmpty(patient)) {
            return;
        } else {
            return (
                <Row bottom="xs" className="vertical-divider">
                    <Col xs={12} md={largeAndMediumWidth} lg={largeAndMediumWidth}>
                        <div id="condition-selection-container">
                            <ConditionSelection
                                conditions={patientConditions}
                                setCondition={this.props.setCondition}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={largeAndMediumWidth} lg={largeAndMediumWidth}>
                        <PatientSearch
                            highlightedSearchSuggestion={this.props.highlightedSearchSuggestion}
                            moveTargetedDataPanelToSubsection={this.props.moveTargetedDataPanelToSubsection}
                            patient={this.props.patient}
                            setSearchSelectedItem={this.props.setSearchSelectedItem}
                            searchIndex={this.props.searchIndex}
                            setSearchSuggestions={this.props.setSearchSuggestions}
                            setHighlightedSearchSuggestion={this.props.setHighlightedSearchSuggestion}
                        />
                    </Col>
                </Row>
            );
        }
    }
    render() {
        const disabledClassName = this.props.isAppBlurred ? 'content-disabled' : '';
        const summaryHeaderWidth = this.props.isTablet? 6 : 4;
        const selectAndSearchWidthLarge = this.props.isTablet? 4 : 6;
        const selectAndSearchWidthMedium = this.props.isTablet? 3 : 5;
        return (
            <div className={`patient-control-panel ${disabledClassName}`}>
                <Paper className="panel-content">
                    <Grid fluid>
                        <Row middle="xs">
                            <Col xs={3} md={3} lg={2} className='logo-title-column'>
                                {this.renderFluxNotesLogo()}
                            </Col>
                            <Col xs={5} md={summaryHeaderWidth} lg={summaryHeaderWidth} className="summary-header-column">
                                {this.renderSummaryHeader()}
                            </Col>
                            <Col xs={4} md={selectAndSearchWidthMedium} lg={selectAndSearchWidthLarge}>
                                {this.renderConditionSelectAndSearch()}
                            </Col>
                        </Row>
                    </Grid>
                </Paper>
            </div>

        );
    }
}

PatientControlPanel.propTypes = {
    appTitle: PropTypes.string.isRequired,
    clinicalEvent: PropTypes.string.isRequired,
    dataAccess: PropTypes.object,
    isAppBlurred: PropTypes.bool,
    isTablet: PropTypes.bool,
    layout: PropTypes.string,
    loadPatient: PropTypes.func,
    logoObject: PropTypes.shape({
        path: PropTypes.string.isRequired,
        altText: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string
    }),
    patient: PropTypes.object,
    possibleClinicalEvents: PropTypes.array.isRequired,
    setCondition: PropTypes.func.isRequired,
    setLayout: PropTypes.func.isRequired,
    setSearchSelectedItem: PropTypes.func.isRequired,
    supportLogin: PropTypes.bool.isRequired,
    searchIndex: PropTypes.object.isRequired,
    setSearchSuggestions: PropTypes.func,
};

export default PatientControlPanel;



