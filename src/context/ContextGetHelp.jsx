import React from 'react';
import PropTypes from 'prop-types';
import './ContextGetHelp.css';
import NoteParser from '../noteparser/NoteParser';


const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const ENTER_KEY = 13;

class ContextGetHelp extends React.Component {
    constructor(props) {
        super(props);
        this.noteParser = new NoteParser();

        // eventually we can set this up to have custom options as a prop
        const defaultOptions = [
            {
                text: 'expand',
                onSelect: this.expand
            }
        ];

        this.state = {
            selectedIndex: -1,
            getHelpOptions: defaultOptions
        };
    }

    componentWillUnmount() {
        this.props.closePortal();
    }

    expand = () => {
        this.props.closePortal();
        const transform = this.replaceCurrentShortcut(this.props.shortcut.metadata.expandedText);
        return this.props.onSelected(transform.apply(), null);
    }

    replaceCurrentShortcut = (selection) => {
        let transform;
        transform = this.props.state.transform();
        const triggers = this.noteParser.getListOfTriggersFromText(selection)[0];
        triggers.forEach((trigger, idx) => {
            if (idx !== 0) {
                transform = this.props.insertShortcut(trigger.definition, trigger.trigger, trigger.selectedValue, transform, 'typed');
            }
            if (idx < triggers.length-1) {
                transform = transform.insertText(selection.substring(trigger.endIndex, triggers[idx+1].startIndex));
            }
            else if (trigger.endIndex < selection.length) {
                transform = transform.insertText(selection.substring(trigger.endIndex));
            }
        });
        return transform;
    }

    setSelectedIndex = (selectedIndex) => {
        this.setState({ selectedIndex });
    }

    /*
     * Change the menu position based on the amount of places to move
     */
    changeMenuPosition = (change) => {
        const optionsCount = this.state.getHelpOptions.length;
        let newSelectedIndex = this.state.selectedIndex;
        if ((change === -1 && this.state.selectedIndex > -1) || (change === 1 && this.state.selectedIndex < optionsCount)) {
            newSelectedIndex = this.state.selectedIndex + change;
        }
        // wrap back to top on down arrow of last option
        if (change === 1 && this.state.selectedIndex === optionsCount) {
            newSelectedIndex = 0;
        }
        this.setSelectedIndex(newSelectedIndex);
    }

    /*
     * Navigate and interact with menu based on button presses
     */
    onKeyDown = (e) => {
        const keyCode = e.which;
        if (keyCode === DOWN_ARROW_KEY || keyCode === UP_ARROW_KEY) {
            e.preventDefault();
            e.stopPropagation();
            const positionChange = (keyCode === DOWN_ARROW_KEY) ? 1 : -1;
            this.changeMenuPosition(positionChange);
        } else if (keyCode === ENTER_KEY) {
            // NOTE: This operations might not work on SyntheticEvents which are populat in react

            // close portal if enter key is pressed but no dropdown option is in focus
            if (this.state.selectedIndex === -1) {
                e.preventDefault();
                e.stopPropagation();
                this.props.closePortal();
            }

            // one of the get help options is selected via enter key
            else if (this.state.selectedIndex > 0) {
                e.preventDefault();
                e.stopPropagation();

                // the parent 'get help' option is not included in the getHelpOptions array
                // but it is included as a selectedIndex, so there is an off by one that needs
                // to be calculated, hence the -1
                return this.state.getHelpOptions[this.state.selectedIndex-1].onSelect();
            }
        }
    }

    renderOptions() {
        // if getHelp is not selected, don't show the additional options
        if (this.state.selectedIndex === -1) return null;

        return (
            <span className="context-get-help-options">
                {this.state.getHelpOptions.map((option, index) => {
                    // the parent 'get help' option is not included in the getHelpOptions array
                    // but it is included as a selectedIndex, so there is an off by one that needs
                    // to be calculated, hence the updatedIndex + 1 from the index of the getHelpOptions
                    const updatedIndex = index + 1;
                    return (
                        <li key={updatedIndex}
                            data-active={this.state.selectedIndex === updatedIndex}
                            onClick={option.onSelect}
                            onMouseEnter={() => { this.setSelectedIndex(updatedIndex); }}
                        >
                            {option.text}
                        </li>
                    );
                })}
            </span>
        );
    }

    renderIsCompleteMessage() {
        const initiatingTrigger = this.props.shortcut.getDisplayText();
        return (
            <ul className="context-get-help" ref="contextGetHelp">
                <li
                    className="context-get-help-li"
                >
                    <span className="context-get-help-text">
                        <i>{initiatingTrigger} is already complete</i>
                    </span>
                </li>
            </ul>
        );
    }

    renderIsMissingParent() {
        const initiatingTrigger = this.props.shortcut.getDisplayText();
        return (
            <ul className="context-get-help" ref="contextGetHelp">
                <li
                    className="context-get-help-li"
                >
                    <span className="context-get-help-text">
                        <i>{initiatingTrigger} is missing a parent</i>
                    </span>
                </li>
            </ul>
        );
    }



    render() {
        // If the shortcut we're responsible for is missing a parent, display a message to the user to avoid confusion
        if (!this.props.shortcut.hasParentContext() && this.props.shortcut.hasChildren()) return this.renderIsMissingParent();
        // If the shortcut we're responsible for is complete, display a message to the user to avoid confusion
        if (this.props.shortcut.isComplete) return this.renderIsCompleteMessage();
        // Else we should display all our getHelp message
        const initiatingTrigger = this.props.shortcut.getDisplayText();
        let iconClass = 'fa fa-angle-';
        this.state.selectedIndex === -1 ? iconClass += 'down' : iconClass += 'up';
        return (
            <ul className="context-get-help" ref="contextGetHelp">
                <li
                    className="context-get-help-li"
                    data-active={this.state.selectedIndex === 0}
                    onMouseEnter={() => { this.setSelectedIndex(0); }}
                >
                    <span className="context-get-help-text">
                        <i>get help with {initiatingTrigger}</i>
                        <span className={iconClass}></span>
                    </span>
                </li>
                {this.renderOptions()}
            </ul>
        );
    }
}

ContextGetHelp.propTypes = {
    closePortal: PropTypes.func.isRequired,
    shortcut: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};

export default ContextGetHelp;