import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import lightBlue from 'material-ui/colors/lightBlue';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { Fade } from 'material-ui';
import _ from 'lodash';

import SecurityManager from '../security/SecurityManager';
import DashboardManager from '../dashboard/DashboardManager';
import ShortcutManager from '../shortcuts/ShortcutManager';
import StructuredFieldMapManager from '../shortcuts/StructuredFieldMapManager';
import ContextManager from '../context/ContextManager';
import DataAccess from '../dataaccess/DataAccess';
import SummaryMetadata from '../summary/SummaryMetadata';
import PatientControlPanel from '../panels/PatientControlPanel';
import PreferenceManager from '../preferences/PreferenceManager';
import SearchIndex from '../patientControl/SearchIndex';
import LoadingAnimation from '../loading/LoadingAnimation';
import LoadingError from '../loading/LoadingError';

import '../styles/FullApp.css';

const theme = createMuiTheme({
    palette: {
        primary: {...lightBlue, A700: '#1384b5'},
        secondary: {...green, A400: '#00e677'},
        error: red
    }
});

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        position: 'absolute',
        width: 400,
        backgroundColor: 'white',
        boxShadow: 'black',
        padding: 8,
    };
}

export class FullApp extends Component {
    constructor(props) {
        super(props);
        window.fluxnotes_app = this;
        this.possibleClinicalEvents = [
            "pre-encounter",
            "encounter",
            "post-encounter"
        ];
        // Determines how long the fade-in v. fade-out animation lasts
        this.timeoutDuration = 1000;

        if (_.isUndefined(this.props.dataSource)) {
            this.dataAccess = new DataAccess("HardCodedMcodeV09DataSource");
        } else {
            this.dataAccess = new DataAccess(this.props.dataSource);
        }

        this.summaryMetadata = new SummaryMetadata(this.setForceRefresh);
        this.dashboardManager = new DashboardManager();
        this.shortcutManager = new ShortcutManager(this.props.shortcuts);
        this.securityManager = new SecurityManager();
        this.structuredFieldMapManager = new StructuredFieldMapManager();
        this.searchIndex = new SearchIndex();

        this.state = {
            clinicalEvent: "pre-encounter",
            condition: null,
            contextManager: this.contextManager,
            errors: [],
            forceRefresh: false,
            highlightedSearchSuggestion: null,
            isAppBlurred: false,
            isNoteViewerVisible: false,
            isNoteViewerEditable: false,
            isModalOpen: false,
            layout: "",
            // Start the app loading information
            loading: true,
            // If there is an error produced when loading data, it will go here
            loadingErrorObject: null,
            loginUser: {},
            modalTitle: '',
            modalContent: '',
            noteClosed: false,
            openClinicalNote: null,
            openSourceNoteEntryId: null,
            patient: null,
            searchSelectedItem: null,
            searchSuggestions: [],
            summaryItemToInsert: '',
            summaryItemToInsertSource: ''
        };

        /*  actions is a list of actions passed to the visualizers
         *  Each action has following properties:
         *      handler          Function defined in FullApp that performs some action when the item is clicked
         *      text             Text to display for this action in the Menu
         *      icon             FontAwesome(?) icon to display
         *      whenToDisplay    Criteria on when to display the action.  Currently has the following properties:
         *                          valueExists          Boolean value indicating whether value should exist.
         *                          existingValueSigned  Boolean value indicating whether value should be signed.  Can be string value "either".
         *                          editableNoteOpen     Boolean value indicating whether note should be open or string "either" if it doesn't matter.
         *                          displayInSubsections Array of strings that define in which subsections the action should be displayed.  Can be left out.
         */
        this.actions = [
            {
                handler: this.handleSummaryItemSelected,
                text: "Insert {elementText}",
                icon: "plus",
                whenToDisplay: {
                    valueExists: true,
                    existingValueSigned: "either",
                    editableNoteOpen: true,
                }
            },
            {
                handler: this.openReferencedNote,
                textfunction: this.nameSourceAction,
                isdisabled: this.sourceActionIsDisabled,
                icon: "sticky-note",
                whenToDisplay: {
                    valueExists: true,
                    existingValueSigned: "either",
                    editableNoteOpen: "either"
                }
            },
            {
                handler: this.addEnrollmentToEditor,
                text: "Enroll patient",
                icon: "check",
                whenToDisplay: {
                    valueExists: true,
                    existingValueSigned: "either",
                    editableNoteOpen: true,
                    displayInSubsections: ["Potential to enroll"],
                    displayForColumns: [0]
                }
            }
        ];
    }

    loadPatient(patientId) {
        const DAGestalt = this.dataAccess.getGestalt();
        if (DAGestalt.read.async) {
            this.dataAccess.getPatient(patientId, (patient, error) => {
                this.contextManager = new ContextManager(patient, this.onContextUpdate);
                if (error) console.error(error);
                this.setState({
                    patient,
                    loading: false,
                    loadingErrorObject: error
                });
            });
        } else if (DAGestalt.read.sync) {
            // Else, assume sync
            try {
                const patient = this.dataAccess.getPatient(patientId);
                this.contextManager = new ContextManager(patient, this.onContextUpdate);
                this.setState({
                    patient,
                    loading: false
                });
            } catch (error) {
                console.error(error);
                this.setState({
                    loading: false,
                    loadingErrorObject: error
                });
            }
        } else {
            const supportedError = Error("Data Source does not support sync or async types read operations -- current gestalt is " + JSON.stringify(DAGestalt));
            console.error(supportedError);
            this.setState({
                loading: false,
                loadingErrorObject: supportedError
            });
        }
    }

    componentWillMount() {
        const userProfile = this.securityManager.getDemoUser(this.props.clinicianId);
        if (userProfile) {
            this.setState({loginUser: userProfile});
            this.preferenceManager = new PreferenceManager(userProfile);
        } else {
            console.error("Login failed");
        }
    }

    componentDidMount() {
        // If we have a custom display, we should update the title of the page
        if (!_.isEmpty(this.props.display)) document.title = this.props.display;
        // If we have a custom logoObject, we should update our favicons
        if (!_.isEmpty(this.props.logoObject)) {
            const icons = document.querySelectorAll('link[rel="icon"]');
            for (const icon of icons) {
                icon.href = this.props.logoObject.path;
            };
        }
        // Once the component has mounted, we can try to load the patient data
        this.loadPatient(this.props.patientId);
    }

    receive_command(commandType, data) {
        if (commandType === 'navigate_targeted_data_panel') {
            const sectionName = data.section;
            const subsectionName = data.subsection;
            return this.dashboard.moveTargetedDataPanelToSubsection(sectionName, subsectionName);
        } else if (commandType === 'insert-structured-phrase') {
            return this.dashboard.insertStructuredPhraseInCurrentNote(data, "command");
        } else {
            return "Unknown command type: " + commandType;
        }
    }

    // pass this function to children to set full app global state
    setFullAppState = (state, value) => {
        this.setState({[state]: value});
    }

    setForceRefresh = (value) => {
        this.setFullAppState('forceRefresh', value);
    }

    setNoteViewerEditable = (value) => {
        this.setFullAppState('isNoteViewerEditable', value);
    }

    setLayout = (layoutView) => {
        this.setFullAppState('layout', layoutView);
    }

    setCondition = (condition) => {
        this.setFullAppState('condition', condition);
    }

    setNoteViewerVisible = (value) => {
        this.setFullAppState('isNoteViewerVisible', value);
    }

    setNoteClosed = (value) => {
        this.setFullAppState('noteClosed', value);
    }

    setSearchSelectedItem = (value) => {
        this.setFullAppState('searchSelectedItem', value);
    }

    // Same function as 'setFullAppState' except this function uses a callback
    setFullAppStateWithCallback = (state, callback) => {
        this.setState(state, callback);
    }

    // Updates the context manager in it's state
    onContextUpdate = () => {
        this.setState({contextManager: this.contextManager});
    }

    // Update the errors based on the argument provided
    updateErrors = (errors) => {
        this.setState({errors});
    }

    // Determines the item to be inserted
    itemInserted = () => {
        this.setState({summaryItemToInsert: '', summaryItemToInsertSource: ''});
    }

    // Given a shortcutClass, a type and an object, create a new shortcut and change errors as needed.
    newCurrentShortcut = (shortcutC, shortcutType, shortcutData, updatePatient = true, source) => {
        let newShortcut = this.shortcutManager.createShortcut(shortcutC, shortcutType, this.state.patient, shortcutData, this.handleShortcutUpdate);
        newShortcut.setSource(source);
        const errors = newShortcut.validateInCurrentContext(this.contextManager);
        if (errors.length > 0) {
            errors.forEach((error) => {
                console.error(error);
            });
            newShortcut = null;
        } else {
            newShortcut.initialize(this.contextManager, shortcutType, updatePatient, shortcutData);
        }
        this.updateErrors(errors);
        return newShortcut;
    }

    // Update shortcuts and update patients accordingly
    handleShortcutUpdate = (s) => {
        const p = this.state.patient;
        const note = this.state.openClinicalNote;
        s.updatePatient(p, this.contextManager, note);
    }

    setOpenClinicalNote = (openClinicalNote) => {
        this.setState({
            openClinicalNote: openClinicalNote
        });
    }

    setOpenSourceNoteEntryId = (openSourceNoteEntryId) => {
        this.setState({ openSourceNoteEntryId });
    }

    sourceActionIsDisabled = (element) => {
        if (!element.source || element.source.sourceMessage === "") {
            return true;
        }
        return false;
    }

    nameSourceAction = (element) => {
        if (element.source) {
            return (element.source.note ? "Open Source Note" :   (element.source.link ?  "View Source Attachment" : (element.source.sourceMessage !== "" ? "View Source" : "No Source information")));
        }
        return "No source information";
    }

    openReferencedNote = (item, itemLabel) => {
        if (item.source.link) {
            window.open(`${item.source.link}`);
        }

        // if item.source.note is defined, open the referenced note
        else if (item.source.note) {
            const sourceNote = this.state.patient.getEntryFromReference(item.source.note);

            this.setState({
                openClinicalNote: sourceNote,
                openSourceNoteEntryId: item.source.entryId.id,
            });
        } else {
            const labelForItem = itemLabel; // (_.isArray(itemLabel) ? itemLabel[0] : itemLabel );
            const valueForItem = _.isObject(item.value) ? item.value.value : item.value;
            const title = "Source for " + (labelForItem === valueForItem ? labelForItem : labelForItem + " of " + valueForItem);
            this.setState({
                isModalOpen: true,
                modalTitle: title,
                modalContent: item.source.sourceMessage
            });
        }
    }

    // Update the summaryItemToInsert based on the item given
    handleSummaryItemSelected = (item, arrayIndex = -1, source = undefined) => {
        if (item) {
            let newStateValues;
            if (_.isArray(item.value)) item.value = item.value[0];
            // calls to this method from the buttons on a ListType pass in 'item' as an array.
            if (_.isArray(item) && arrayIndex >= 0) {
                // If the object to insert has an associated shortcut, is will be an object like {name: x, shortcut: z}
                if (_.isObject(item[arrayIndex])) {
                    newStateValues = { summaryItemToInsert: `${item[arrayIndex].shortcut}[[${item[arrayIndex].name}]]` };
                } else {
                    newStateValues = { summaryItemToInsert: item[arrayIndex] };
                }
            } else if (item.shortcutData) {
                if (item.shortcutData.entryId) {
                    newStateValues = { summaryItemToInsert: `${item.shortcutData.shortcut}[[{"text":"${item.value}", "entryId":"${item.shortcutData.entryId}"}]]` };
                } else {
                    newStateValues = { summaryItemToInsert: `${item.shortcutData.shortcut}[[${item.value}]]` };
                }
            } else if (item.value) {
                newStateValues = { summaryItemToInsert: item.value };
            } else {
                newStateValues = { summaryItemToInsert: item };
            }
            if (!_.isUndefined(source)) {
                newStateValues["summaryItemToInsertSource"] = source;
            }
            this.setState(newStateValues);
        }
    }

    // Enrolls the patient in the selected trial
    addEnrollmentToEditor = (item) => {
        this.setState({ summaryItemToInsert: `#enrollment #${item.value}`, summaryItemToInsertSource: 'Targeted Data Panel action'});
    }

    handleModalClose = () => {
        this.setState({ isModalOpen: false });
    }

    moveTargetedDataPanelToSubsection = (sectionName, subsectionName) => {
        return this.dashboard.moveTargetedDataPanelToSubsection(sectionName, subsectionName);
    }

    setSearchSuggestions = (suggestions) => {
        this.setState({
            searchSuggestions: suggestions
        });
    }

    setHighlightedSearchSuggestion = (suggestion) => {
        this.setState({
            highlightedSearchSuggestion: suggestion
        });
    }

    setAppBlur = (isAppBlurred) => {
        this.setState({ isAppBlurred });
    }

    renderLoadingInformation = () => {
        // Note well: The renders below fade in or out based on state of the loading in the app
        // We define a loading error as occuring when:
        // - The app has no patient
        // - The app is not loading
        const isSomeError = _.isEmpty(this.state.patient) && !this.state.loading;
        if (this.state.loading || isSomeError) { // don't render div if we aren't loading and we don't have an error
            return (
                <div>
                    <LoadingAnimation
                        loading={this.state.loading}
                        timeoutDuration={this.timeoutDuration}
                    />
                    <LoadingError
                        isSomeError={isSomeError}
                        loadingErrorObject={this.state.loadingErrorObject}
                        timeoutDuration={this.timeoutDuration}
                    />
                </div>
            );
        } else {
            return "";
        }
    }

    render() {
        // Get the Current Dashboard based on superRole of user
        const CurrentDashboard = this.dashboardManager.getDashboardForSuperRole(this.state.loginUser.getSuperRole());
        return (
            <MuiThemeProvider theme={theme}>
                <div className={(this.state.loading || this.state.loadingErrorObject) ? "FullApp-content loading-background" : "FullApp-content"}>
                    <Grid fluid>
                        <Row center="xs">
                            <Col sm={12}>
                                <PatientControlPanel
                                    appTitle={this.props.display}
                                    clinicalEvent={this.state.clinicalEvent}
                                    highlightedSearchSuggestion={this.state.highlightedSearchSuggestion}
                                    isAppBlurred={this.state.isAppBlurred}
                                    layout={this.state.layout}
                                    loginUsername={this.state.loginUser.getUserName()}
                                    logoObject={this.props.logoObject}
                                    moveTargetedDataPanelToSubsection={this.moveTargetedDataPanelToSubsection}
                                    patient={this.state.patient}
                                    possibleClinicalEvents={this.possibleClinicalEvents}
                                    searchIndex={this.searchIndex}
                                    setCondition={this.setCondition}
                                    setHighlightedSearchSuggestion={this.setHighlightedSearchSuggestion}
                                    setLayout={this.setLayout}
                                    setSearchSelectedItem={this.setSearchSelectedItem}
                                    setSearchSuggestions={this.setSearchSuggestions}
                                    supportLogin={true}
                                />
                            </Col>
                        </Row>
                        {this.renderLoadingInformation()}
                        <Fade in={!this.state.loading} timeout={this.timeoutDuration}>
                            <div>
                                {!_.isNull(this.state.patient) &&
                                    <CurrentDashboard
                                        // App default settings
                                        actions={this.actions}
                                        appState={this.state}
                                        contextManager={this.contextManager}
                                        dataAccess={this.dataAccess}
                                        forceRefresh={this.state.forceRefresh}
                                        handleSummaryItemSelected={this.handleSummaryItemSelected}
                                        highlightedSearchSuggestion={this.state.highlightedSearchSuggestion}
                                        isAppBlurred={this.state.isAppBlurred}
                                        itemInserted={this.itemInserted}
                                        loginUser={this.state.loginUser}
                                        preferenceManager={this.preferenceManager}
                                        newCurrentShortcut={this.newCurrentShortcut}
                                        onContextUpdate={this.onContextUpdate}
                                        openSourceNoteEntryId={this.state.openSourceNoteEntryId}
                                        possibleClinicalEvents={this.possibleClinicalEvents}
                                        ref={(dashboard) => { this.dashboard = dashboard; }}
                                        searchIndex={this.searchIndex}
                                        searchSelectedItem={this.state.searchSelectedItem}
                                        searchSuggestions={this.state.searchSuggestions}
                                        setAppBlur={this.setAppBlur}
                                        setHighlightedSearchSuggestion={this.setHighlightedSearchSuggestion}
                                        setNoteClosed={this.setNoteClosed}
                                        setNoteViewerEditable={this.setNoteViewerEditable}
                                        setNoteViewerVisible={this.setNoteViewerVisible}
                                        setForceRefresh={this.setForceRefresh}
                                        setFullAppStateWithCallback={this.setFullAppStateWithCallback}
                                        setLayout={this.setLayout}
                                        setOpenClinicalNote={this.setOpenClinicalNote}
                                        setOpenSourceNoteEntryId={this.setOpenSourceNoteEntryId}
                                        setSearchSelectedItem={this.setSearchSelectedItem}
                                        shortcutManager={this.shortcutManager}
                                        structuredFieldMapManager={this.structuredFieldMapManager}
                                        summaryMetadata={this.summaryMetadata}
                                        updateErrors={this.updateErrors}
                                    />
                                }
                            </div>
                        </Fade>
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.isModalOpen}
                            onClose={this.handleModalClose}
                            onClick={this.handleModalClose}
                        >
                            <div style={getModalStyle()} >
                                <Typography id="modal-title">
                                    {this.state.modalTitle}
                                </Typography>
                                <Typography id="simple-modal-description">
                                    {this.state.modalContent}
                                </Typography>
                            </div>
                        </Modal>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );
    }
}

FullApp.propTypes = {
    dataSource: PropTypes.string.isRequired,
    display: PropTypes.string.isRequired,
    logoObject: PropTypes.shape({
        path: PropTypes.string.isRequired,
        altText: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string
    }),
    shortcuts: PropTypes.array.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    // TODO: add actions
    }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
    return {
    // TODO: add state
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FullApp);
