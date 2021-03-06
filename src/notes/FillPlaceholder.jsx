import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
// import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FontAwesome from 'react-fontawesome';
import Calendar from 'rc-calendar';
import moment from 'moment';
import Lang from 'lodash';
import ButtonSetFillFieldForPlaceholder from './fillFieldComponents/ButtonSetFillFieldForPlaceholder';
import MultiButtonSetFillFieldForPlaceholder from './fillFieldComponents/MultiButtonSetFillFieldForPlaceholder';
import MenuItemSetFillForPlaceholder from './fillFieldComponents/MenuItemSetFillForPlaceholder';
import Button from '../elements/Button';
import 'rc-calendar/assets/index.css';

import './FillPlaceholder.css';
import SearchableListForPlaceholder from './fillFieldComponents/SearchableListForPlaceholder';

export default class FillPlaceholder extends Component {
    constructor(props) {
        super(props);
        const { placeholder } = props;

        this.onDone = this.onDone.bind(this);
        this.calendarDom = null;

        let done = false;

        // If placeholder had been previously filled out, mark as done.
        if (placeholder.done) done = true;

        this.state = {
            done,
            expanded: false,
            error: null,
            entriesToShowDetails: [],
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    fillFromData = (data, source) => {
        const { placeholder } = this.props;
        let errorToReturn = null, error; // return first error only

        let entryIndex = 0;
        if (placeholder.multiplicity === 'many') {
            // original implementation to determine if we should add a new entry or not for a multiple-entry placeholder
            // if first field of the last entry has a value, we add a new one else we use it
            const lastEntryIndex = placeholder.entryShortcuts.length - 1;
            /*            const valFirstField = placeholder.getAttributeValue(data.fields[0].name, lastEntryIndex);
            if (Lang.isUndefined(valFirstField) || Lang.isNull(valFirstField) || valFirstField.length === 0) {
                entryIndex = lastEntryIndex;
            } else {
                this.addEntry();
                entryIndex = lastEntryIndex + 1;
            }*/

            if (Lang.isUndefined(placeholder.entryShortcuts[lastEntryIndex].getSource())) {
                // undefined source on last entry
                entryIndex = lastEntryIndex;
            } else {
                this.addEntry();
                entryIndex = lastEntryIndex + 1;
            }
            // new implementation. If the last entry has a source, we add a new one else we use it
        }

        data.fields.forEach((field) => {
            error = this.onSetValue(source, { name: field.name }, entryIndex, field.value);
            if (!Lang.isNull(error) && Lang.isNull(errorToReturn)) errorToReturn = error;
        });

        if (Lang.isNull(errorToReturn) && placeholder.multiplicity !== 'many') {
            this.setState({ done: true });
        }
        return errorToReturn;
    }

    handleClick = (event) => {
        if (this.calendarDom && !this.calendarDom.contains(event.target)) this.setState({ showCalendar: false });
    }

    onDone = (event) => {
        let { done } = this.state;
        const { placeholder } = this.props;

        done = event.target.checked;
        placeholder.done = event.target.checked;
        this.setState({ done, expanded: false });
    };

    onExpand = (event) => {
        const { expanded } = this.state;

        this.setState({ expanded: !expanded });
    };

    onSetValue = (source, attributeSpec, entryIndex, newValue) => {
        const { placeholder } = this.props;
        //if (entryIndex === -1) entryIndex = placeholder.entryShortcuts.length - 1;
        const attributes = placeholder.getAttributeValue(attributeSpec.name, entryIndex);
        let error;

        if (Lang.isArray(attributes) && Lang.includes(attributes, newValue)) {
            Lang.remove(attributes, attr => attr === newValue);
            error = placeholder.setAttributeValue(attributeSpec.name, attributes, entryIndex, source);
        } else {
            error = placeholder.setAttributeValue(attributeSpec.name, newValue, entryIndex, source);
        }

        this.setState({ error });
        return error;
    };

    setCalendarTrue = (attributeSpec) => {
        this.setState({
            calendarAttributeSpec: attributeSpec.name,
            showCalendar: true,
        });
    }

    handleClick = (event) => {
        if (this.calendarDom && !this.calendarDom.contains(event.target)) this.setState({ showCalendar: false });
    }

    handleCalendarSelect = (attributeSpec, entryIndex = 0, date) => {
        const dateSelected = date.format('D MMM YYYY');
        this.onSetValue("click/touch", attributeSpec, entryIndex, dateSelected);
        this.setState({ showCalendar: false });
    }

    renderShowHide = (entryIndex) => {
        const { entriesToShowDetails } = this.state;
        const currentFieldShowsDetails = entriesToShowDetails.findIndex(field => field === entryIndex);
        if (currentFieldShowsDetails > -1) {
            return (
                <span
                    className='link'
                    onClick={() => { entriesToShowDetails.splice(currentFieldShowsDetails, 1); this.setState({ entriesToShowDetails }); }}>
                    Hide details
                </span>
            );
        }
        return (
            <span
                className='link'
                onClick={() => { entriesToShowDetails.push(entryIndex); this.setState({ entriesToShowDetails }); }}>
                Show details
            </span>
        );
    }

    createFillFieldForPlaceholder = (attributeSpec, value, entryIndex = 0) => {
        const { calendarAttributeSpec, showCalendar } = this.state;
        const { backgroundColor, placeholder } = this.props;

        if (attributeSpec.type === 'radioButtons') {
            return <ButtonSetFillFieldForPlaceholder attributeSpec={attributeSpec} value={value} updateValue={this.onSetValue.bind(this, "click/touch", attributeSpec, entryIndex)} />;
        }
        if (attributeSpec.type === 'checkboxes') {
            return <MultiButtonSetFillFieldForPlaceholder attributeSpec={attributeSpec} value={value} updateValue={this.onSetValue.bind(this, "click/touch", attributeSpec, entryIndex)} />;
        }
        if (attributeSpec.type === 'searchableList') {
            return <SearchableListForPlaceholder attributeSpec={attributeSpec} backgroundColor={backgroundColor} value={value} updateValue={this.onSetValue.bind(this, "click/touch", attributeSpec, entryIndex)} />;
        }
        if (attributeSpec.type === 'date') {
            let date = new Date(placeholder.getAttributeValue(attributeSpec.name));
            date = moment(date).format('MM/DD/YYYY');

            return (
                <div>
                    <button className='date-picker-button' onClick={this.setCalendarTrue.bind(this, attributeSpec)}>
                        {(placeholder.getAttributeValue(attributeSpec.name)) ? date : 'MM/DD/YYYY'}
                        <div className="arrow-container"><i className="arrow-down"></i></div>
                    </button>
                    {(showCalendar && (attributeSpec.name === calendarAttributeSpec))
                        ?
                        <div className='date-picker-container' ref={(calendarDom) => this.calendarDom = calendarDom}>
                            <Calendar
                                showDateInput={false}
                                onSelect={this.handleCalendarSelect.bind(this, attributeSpec, entryIndex)}
                                style={{ position: 'absolute', top: '0px', left: '0px' }}
                            />
                        </div>
                        :
                        null
                    }
                </div>
            );
        }
        if (attributeSpec.type === 'menuItems') {
            const showDetails = this.state.entriesToShowDetails.findIndex(field => field === entryIndex) > -1;
            const baseFieldAttribute = placeholder.attributes.find(attr => attr.name === attributeSpec.values.baseField);
            let baseFieldValue = '';
            if (baseFieldAttribute) {
                baseFieldValue = placeholder.getAttributeValue(baseFieldAttribute.name, entryIndex);
            }
            return (
                <MenuItemSetFillForPlaceholder
                    showDetails={showDetails}
                    attributeSpec={attributeSpec}
                    value={value}
                    baseField={attributeSpec.values.baseField}
                    baseValue={baseFieldValue}
                    updateValue={this.onSetValue.bind(this, "click/touch", attributeSpec, entryIndex)}
                />
            );
        }

        return (
            <div>
                Unknown component type: {attributeSpec.type}
            </div>
        );
    }

    createCurrentFieldRowInSummary = (attribute, entryIndex = 0) => {
        const { done, expanded } = this.state;
        const { placeholder } = this.props;
        let currentFieldRowInSummary = '';
        let multiSelect = "";
        let centerFieldName = 'centered-field';
        if (attribute.type === 'checkboxes') {
            multiSelect =
                <span className="multi-select"> (select multiple) </span>;
        }

        const value = placeholder.getAttributeValue(attribute.name, entryIndex);
        if (attribute.type === 'radioButtons' || attribute.type === 'checkboxes' || attribute.type === 'menuItems') {
            centerFieldName = 'not-centered-field';
        }
        if (expanded || !done) {
            currentFieldRowInSummary = (
                <Grid className="field-row" container key={attribute.name}>
                    <Grid item xs={1} />
                    <Grid item xs={2} style={{ display: 'flex' }} className={centerFieldName}>
                        <span className="attribute-title">
                            {attribute.title} <br />
                            {multiSelect}
                            {attribute.type === 'menuItems' && this.renderShowHide(entryIndex)}
                        </span>
                    </Grid>
                    <Grid item xs={7}>
                        <span>
                            {this.createFillFieldForPlaceholder(attribute, value, entryIndex)}
                        </span>
                    </Grid>
                </Grid>
            );
        }

        return currentFieldRowInSummary;
    };

    addEntry = () => {
        const { placeholder } = this.props;
        placeholder.addEntry();
    }

    deleteEntry = (entryIndex) => {
        const { placeholder } = this.props;
        placeholder.deleteEntry(entryIndex);
    }

    createAllRows = (entryIndex = 0) => {
        const { placeholder } = this.props;

        return placeholder.attributes.map(attr => this.createCurrentFieldRowInSummary(attr, entryIndex));
    };

    isValidAttribute = value => !(Lang.isNull(value) || Lang.isUndefined(value) || value === '' || (Lang.isArray(value) && value.length === 0))

    renderAddButton = () => {
        const { done } = this.state;
        const { placeholder } = this.props;
        const shortcutNameWithoutPrefix = placeholder.shortcutDisplayText;

        let addButton = '';
        if (!done) {
            addButton = (
                <Button
                    onClick={this.addEntry}
                    style={{ float: 'right' }}
                >
                    <FontAwesome
                        name="plus"
                        style={{
                            color: 'rgb(26, 143, 221)',
                            marginRight: '5px',
                        }}
                    />
                    <span>
                        {`Add ${shortcutNameWithoutPrefix}`}
                    </span>
                </Button>
            );
        }

        return addButton;
    }

    renderDeleteButton = (entryIndex) => {
        const { done } = this.state;
        const { placeholder } = this.props;
        const shortcutNameWithoutPrefix = placeholder.shortcutDisplayText;

        let deleteButton = '';
        if (!done) {
            deleteButton = (
                <Button
                    onClick={this.deleteEntry.bind(this, entryIndex)}
                    style={{ float: 'right' }}
                >
                    <FontAwesome
                        name="times"
                        style={{
                            color: 'red',
                            marginRight: '5px',
                        }}
                    />
                    <span>
                        {`Delete ${shortcutNameWithoutPrefix}`}
                    </span>
                </Button>
            );
        }

        return deleteButton;
    }

    renderError = () => {
        const { error } = this.state;

        let errorString = '';
        if (!Lang.isNull(error)) {
            errorString = (
                <span className="error-message">
                    {error}
                </span>
            );
        }

        return errorString;
    }

    renderCheckbox = () => {
        // const { done } = this.state;
        const { placeholder } = this.props;

        return (
            <Grid item xs={2} className='checkbox-container'>
                {/* <span className="done-checkbox">
                    <Checkbox style={{ width: 26, height: 26 }} checked={done} value="done" onChange={this.onDone} color="primary" />
                </span> */}
                <span className="shortcut-name" key="0">
                    {placeholder.shortcutDisplayText}
                </span>
            </Grid>
        );
    }

    renderColumns = (entryIndex = 0) => {
        const { placeholder } = this.props;
        const columns = [];

        placeholder.attributes.forEach((attribute, attributeIndex) => {
            const value = placeholder.getAttributeValue(attribute.name, entryIndex);

            columns.push(<span className="shortcut-field-title" key={`${entryIndex}-${attributeIndex}-label`}>{`${attribute.title}: `}</span>);
            if (!this.isValidAttribute(value)) {
                columns.push(<span className="fill-missing-data" key={`${entryIndex}-${attributeIndex}-value`}>No Data</span>);
            } else {
                columns.push(<span className="fill-structured-data" key={`${entryIndex}-${attributeIndex}-value`}>{Lang.isArray(value) ? value.join(', ') : value}</span>);
            }
        });

        return columns;
    }

    renderSingleEntryPlaceholder = () => {
        const { expanded, done } = this.state;
        const { backgroundColor } = this.props;
        let expandIcon = done ? "" : <ExpandMoreIcon onClick={this.onExpand} className='expand-icon' />; // remove expand icon if done
        expandIcon = expanded ? <ExpandMoreIcon onClick={this.onExpand} className='close-expand-icon' /> : expandIcon;

        return (
            <ExpansionPanel expanded={expanded} className="expanded-style">
                <ExpansionPanelSummary className='summary-panel' style={{ backgroundColor, cursor: 'default' }} expandIcon={expandIcon}>
                    <Grid container>
                        {this.renderCheckbox()}
                        <Grid item xs={10} style={{ width: '100%' }}>
                            {this.renderColumns()}
                        </Grid>
                        {this.renderError()}
                    </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ backgroundColor }}>
                    <Grid container>
                        {expanded ? this.createAllRows() : null}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    renderMultipleEntriesPlaceholder = () => {
        const { expanded, done } = this.state;
        const { backgroundColor, placeholder } = this.props;
        // Loop through all entries and render summaries
        let entries;
        if (!expanded) {
            entries = placeholder.entryShortcuts.map((_, i) => {
                return (
                    <Grid container key={`${i}-container`}>
                        {i === 0 ? this.renderCheckbox() : <Grid item xs={2} />}
                        <Grid item xs={10} md={10}>
                            {this.renderColumns(i)}
                            {placeholder.entryShortcuts.length === 1 ? null : this.renderDeleteButton(i)}
                        </Grid>
                        <Divider className="divider" id="poc-divider" />
                    </Grid>
                );
            });
        }

        // Only render checkbox in expansion summary when expanion panel is expanded
        const expansionSummary = expanded
            ? (
                <Grid container>
                    {this.renderCheckbox()}
                </Grid>
            )
            : (
                <div style={{ width: '100%' }}>
                    {this.renderError()}
                    {entries}
                    <div style={{ width: '100%' }}>
                        {this.renderAddButton()}
                    </div>
                </div>
            );

        // When expanded, render column and all rows for each entry
        let allRowsAndColumns;
        if (expanded) {
            allRowsAndColumns = placeholder.entryShortcuts.map((_, i) => (
                <Grid container key={`${i}-expanded-rows`}>
                    <Grid item xs={3} />
                    <Grid item xs={9}>
                        <div style={{marginLeft: '-70px'}}>
                            {this.renderColumns(i)}
                        </div>
                        {placeholder.entryShortcuts.length === 1 ? null : this.renderDeleteButton(i)}
                    </Grid>
                    {this.createAllRows(i)}
                    <Divider className="divider" id="poc-divider" />
                </Grid>
            ));
        }
        const expansionDetails = !expanded ? '' : (
            <Grid container style={{zIndex: 0}}>
                {this.renderError()}
                {allRowsAndColumns}
                <div style={{ width: '100%' }}>
                    {this.renderAddButton()}
                </div>
            </Grid>
        );
        let expandIcon = done ? "" : <ExpandMoreIcon onClick={this.onExpand} className='expand-icon' />; // remove expand icon if done
        expandIcon = expanded ? <ExpandMoreIcon onClick={this.onExpand} className='close-expand-icon' /> : expandIcon;
        return (
            <ExpansionPanel expanded={expanded} className="expanded-style">
                <ExpansionPanelSummary className='summary-panel' style={{ backgroundColor, cursor: 'default' }} expandIcon={expandIcon}>
                    {expansionSummary}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ backgroundColor , marginTop: '-50px'}}>
                    {expansionDetails}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    render() {
        const { placeholder } = this.props;

        return !placeholder.multiplicity ? this.renderSingleEntryPlaceholder() : this.renderMultipleEntriesPlaceholder();
    }
}

FillPlaceholder.propTypes = {
    placeholder: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string.isRequired,
};