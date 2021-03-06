import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialButton from 'material-ui/Button';
import SingleChoiceButton from '../forms/SingleChoiceButton';
import Tooltip from 'rc-tooltip';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import Lang from 'lodash';
import './PickListOptionsPanel.css';

export default class PickListOptionsPanel extends Component {
    constructor(props) {
        super(props);
        // Add an index at the end of trigger string to differentiate shortcuts with the same trigger
        this.arrayOfPickLists = this.props.arrayOfPickLists.map((pickList, i) => {
            return {
                trigger: pickList.trigger + `_${i}`,
                options: pickList.options,
                shortcut: pickList.shortcut
            };
        });
        // triggerSelections are the selections made by the user for each pick List
        // pushing the trigger value first so that order of shortcuts remain the same
        const triggerSelections = this.arrayOfPickLists.map((pickList) => {
            return {
                trigger: pickList.trigger,
                shortcut: pickList.shortcut
            };
        });

        this.state = {
            triggerSelections,
            tooltipVisibility: 'visible',
            isAllSelected: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Only one selection required from the user so just send results back to NotesPanel after selection
        if (!nextProps.insertingTemplate && nextState.isAllSelected) {
            this.handleOkButtonClick();
            return false;
        }

        return true;
    }

    mouseLeave = () => {
        this.setState({ tooltipVisibility: 'hidden' });
    }

    mouseEnter = () => {
        this.setState({ tooltipVisibility: 'visible' });
    }

    // Switch view (i.e clinical notes view or context tray)
    toggleView(mode) {
        this.props.updateNoteAssistantMode(mode);
    }

    // Cancels insertion of text and clears any context
    handleCancelButtonClick = () => {
        this.props.setUndoTemplateInsertion(true);
        this.props.updateContextTrayItemToInsert(null);
        this.props.setInsertingTemplate(false);
        this.toggleView('context-tray');
    }

    // Pass array of select of pick list options to be used in updating the contextTrayItem to be inserted
    handleInsertChosenOption = () => {
        // Verify that we have an option for each pick list
        const isAllSelected = this.state.triggerSelections.every((triggerSelection) => {
            return !Lang.isUndefined(triggerSelection.selectedOption);
        });

        this.setState({ isAllSelected });

        const triggerSelections = this.state.triggerSelections.map((triggerSelection, i) => {
            const underScoreIndex = triggerSelection.trigger.indexOf("_");
            const selectedOption = triggerSelection.selectedOption
                ? triggerSelection.selectedOption.context
                : triggerSelection.selectedOption;
            return {
                trigger: triggerSelection.trigger.slice(0, underScoreIndex),
                selectedOption: selectedOption,
                shortcut: triggerSelection.shortcut
            };
        });

        this.props.updateSelectedPickListOptions(triggerSelections);
    }

    handleOkButtonClick = () => {
        this.props.updateContextTrayItemToInsert(null);
        this.props.setInsertingTemplate(false);
        this.props.changeShortcutType(null, false, null);
        this.toggleView('context-tray');
    }

    handleOptionButtonClick(option, trigger) {
        this.updateSelectedOptions(option, trigger);
    }

    handleOptionDropDownSelection(index, options, trigger) {
        if (index >= 0) {
            this.updateSelectedOptions(options[index], trigger);
        }
    }

    // Update triggerSelections array, which keeps track of the option selected by the user for each pick list.
    // Note: Only one option is saved per pick list
    updateSelectedOptions(selectedOption, trigger) {
        const index = this.state.triggerSelections.findIndex((option) => {
            return trigger === option.trigger;
        });

        // Find index of trigger in triggerSelections and set the selectedOption
        if (index >= 0) {
            const triggerSelections = [...this.state.triggerSelections];
            triggerSelections[index].selectedOption = selectedOption;
            this.setState({ triggerSelections });
            this.handleInsertChosenOption();
        } else {
            console.error(`Trigger ${trigger} is not in triggerSelections array.`);
        }
    }

    changeShortcutType(shortcut, type, e) {
        if (this.props.insertingTemplate) {
            e.persist();
            this.props.changeShortcutType(shortcut.getKey(), true, type);
        }
    }

    // Render pick list options
    renderOptions(pickLists, i) {
        // Loop through each shortcut in the array and render the options
        return (
            pickLists.map((shortcut, i) => {
                const underScoreIndex = shortcut.trigger.indexOf("_");
                let shortcutName = shortcut.trigger.slice(1, underScoreIndex);
                shortcutName = shortcutName.charAt(0).toUpperCase() + shortcutName.slice(1);
                return (
                    <div id={i} key={i}className="shortcut-options-container"
                        onMouseEnter={(e) => this.changeShortcutType(shortcut.shortcut, 'bolded_structured_field', e)}
                        onMouseLeave={(e) => this.changeShortcutType(shortcut.shortcut, 'structured_field', e)}>
                        {shortcutName}
                        {this.renderShortcutOptions(shortcut, i)}
                    </div>
                );
            })
        );
    }

    // Render the options for each pick list (shortcut)
    renderShortcutOptions(shortcut, i) {
        const options = shortcut.options;
        const trigger = shortcut.trigger;

        // If the number of options is small, generate buttons for each button
        if (options.length < 5) {
            const triggerIndex = this.state.triggerSelections.findIndex(triggerSelection => trigger === triggerSelection.trigger);

            return (
                options.map((option, i) => {
                    return (
                        <div key={i}>
                            <Tooltip
                                key={i}
                                overlayStyle={{ 'visibility': this.state.tooltipVisibility }}
                                placement="left"
                                overlayClassName={`option-tooltip`}
                                overlay={`${option.context} ${option.date}`}
                                destroyTooltipOnHide={true}
                                mouseEnterDelay={1.0}
                                onMouseEnter={this.mouseEnter}
                                onMouseLeave={this.mouseLeave}
                            >
                                <div>
                                    <SingleChoiceButton
                                        buttonKey={i}
                                        className="option-btn"
                                        buttonText={`${option.context} ${option.date}`}
                                        onClick={(e) => this.handleOptionButtonClick(option, trigger)}
                                        isSelected={option === this.state.triggerSelections[triggerIndex].selectedOption}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    );
                })

            );
        }
        // If there are a lot of options, render a drop down instead of buttons
        else {
            const triggerIndex = this.state.triggerSelections.findIndex((triggerSelection) => {
                return trigger === triggerSelection.trigger && !Lang.isUndefined(triggerSelection.selectedOption);
            });
            const dropDownIndex = triggerIndex === -1 ? -1 : options.indexOf(this.state.triggerSelections[triggerIndex].selectedOption);

            return (
                <div className="option-select-container">
                    <Select
                        className="option-select"
                        value={dropDownIndex}
                        onChange={(event) => this.handleOptionDropDownSelection(event.target.value, options, trigger)}
                    >
                        <MenuItem
                            className="option-item"
                            value={dropDownIndex}>
                            <i>Select an option</i>
                        </MenuItem>
                        {this.renderOptionList(options)}
                    </Select>
                </div>
            );
        }
    }

    // Render option list for the drop dow
    renderOptionList(options) {
        return options.map((option, index) =>
            <MenuItem
                className="option-item"
                key={`option-${index}`}
                value={index}
            >
                <span>
                    {option.context}
                </span>
                <span className="right-aligned">
                    {option.date}
                </span>

            </MenuItem>
        );
    }

    render() {
        return (
            <div id="pickList-options-panel">

                <div id="pickList-options">
                    {this.renderOptions(this.arrayOfPickLists)}
                </div>

                <div id="pickList-action-buttons">
                    <MaterialButton
                        variant="raised"
                        id="cancel-btn"
                        onClick={this.handleCancelButtonClick}>
                        Cancel
                    </MaterialButton>

                    {this.state.isAllSelected ?
                        <MaterialButton
                            variant="raised"
                            id="ok-btn"
                            onClick={this.handleOkButtonClick}
                        >
                            Ok
                        </MaterialButton> : null
                    }
                </div>
            </div>
        );
    }
}

PickListOptionsPanel.propTypes = {
    arrayOfPickLists: PropTypes.array.isRequired,
    changeShortcutType: PropTypes.func.isRequired,
    contextManager: PropTypes.object.isRequired,
    insertingTemplate: PropTypes.bool.isRequired,
    setInsertingTemplate: PropTypes.func.isRequired,
    setUndoTemplateInsertion: PropTypes.func.isRequired,
    updateContextTrayItemToInsert: PropTypes.func.isRequired,
    updateSelectedPickListOptions: PropTypes.func.isRequired,
    updateNoteAssistantMode: PropTypes.func.isRequired,
};
