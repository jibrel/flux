import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import SearchSuggestion from './SearchSuggestion.jsx';
import SearchInput from './SearchInput.jsx';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        width: "25vw",
        minWidth: "250px",
        zIndex: 1,
        marginTop: theme.spacing.unit,
        right: 0,
        padding: "8px auto",
    }
});


function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

class PatientSearch extends React.Component { 
    constructor(props) { 
        super(props)
        const patient = props.patient;
        const firstName = patient.getName() ? patient.getName().split(' ')[0] : "";
        this.state = {
            firstName: firstName,
        };
    }

    findThisItem = (note) => {
        this.props.setFullAppState('searchSelectedItem', note)
    }

    getSuggestions(inputValue) {
        const notes = this.props.patient.getNotes();

        return notes.reduce((suggestions, note) => {
            //TODO: Fix to search for best options, not just the first five. 
            // If we need more suggestions and there is content in the note
            if (suggestions.length < 5 && note.content && inputValue) {
                //  Establish some common variables for our regex
                inputValue = inputValue.toLowerCase();
                const spaceOrPeriod = '([^\\S\\n]|\\.)'; 
                const possibleTrigger = '(@|#|\\[\\[|\\]\\]){0,1}';
                const continueToNextWord = `(\\S*${spaceOrPeriod}\\S*){0,2}`;
                const escapedInput = escapeRegExp(inputValue);
                const inputPattern = `(${spaceOrPeriod}${possibleTrigger}${escapedInput}|^${possibleTrigger}${escapedInput})`;
                const regex = new RegExp(inputPattern);
                // Search note content
                const relevantNoteContent = (note.content).toLowerCase();
                const contentMatches = regex.exec(relevantNoteContent);
                // Search note metadata
                const relevantNoteMetadata = (
                    note.date + ' ' +
                    note.subject + ' ' +
                    note.hospital
                ).toLowerCase();
                const metadataMatches = regex.exec(relevantNoteMetadata);
                // NewSuggestion object -- to be pushed with relevant data if there's a match
                let newSuggestion = { 
                    date: note.date,
                    subject: note.subject,
                    hospital: note.hospital,
                    inputValue: inputValue,
                    note: note,
                }
                if (contentMatches) { 
                    // Want a snapshot of text surrounding matched text
                    const inputPatternForSnapshot = `(${spaceOrPeriod}${possibleTrigger}${escapedInput}${continueToNextWord}|^${possibleTrigger}${escapedInput}${continueToNextWord})`;
                    const regexForSnapshot = new RegExp(inputPatternForSnapshot);
                    const contentMatchesForSnapshot = regexForSnapshot.exec(relevantNoteContent);
                    // Add additional metadata, push to suggestions
                    newSuggestion.contentSnapshot = contentMatchesForSnapshot[0].slice(0, 25);
                    newSuggestion.matchedOn = "contentSnapshot";
                    suggestions.push(newSuggestion);
                } else if(metadataMatches) {
                    let matchedMetaData; 
                    if (note.date.toLowerCase().indexOf(inputValue) !== -1) {
                        matchedMetaData = "date";
                    } else if (note.subject.toLowerCase().indexOf(inputValue) !== -1) {
                        matchedMetaData = "subject";
                    } else if (note.hospital.toLowerCase().indexOf(inputValue) !== -1) {
                        matchedMetaData = "hospital";
                    }
                    // Add additional metadata, push to suggestions
                    newSuggestion.contentSnapshot = note.content.slice(0, 25);
                    newSuggestion.matchedOn = matchedMetaData;
                    suggestions.push(newSuggestion);
                }
            }
            return suggestions;
        }, []); 
    }

    render () { 
        const { classes, setFullAppState } = this.props;

        return (
            <div className={classes.root}>
                <Downshift
                    defaultHighlightedIndex={0}
                >
                    {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {
                        return (
                            <div className={classes.container}>
                                <SearchInput
                                    fullWidth={true}
                                    classes={classes}
                                    InputProps={getInputProps({
                                        placeholder: `Search ${this.state.firstName}'s notes`,
                                        id: 'integration-downshift-simple',
                                        onKeyDown: (event) => {
                                            if (event.key === 'Enter' && this.getSuggestions(inputValue)[highlightedIndex]) {
                                                const selectedElement = this.getSuggestions(inputValue)[highlightedIndex];
                                                this.findThisItem(selectedElement.note);
                                            }
                                        },
                                    })}
                                />
                                {isOpen 
                                    ? (
                                        <Paper className={classes.paper} square>
                                            {this.getSuggestions(inputValue).map((suggestion, index) => { 
                                                return (
                                                    <SearchSuggestion
                                                        suggestion={suggestion}
                                                        key={suggestion.date + suggestion.subject}
                                                        index={index}
                                                        itemProps={getItemProps({ item: suggestion.contentSnapshot })}
                                                        highlightedIndex={highlightedIndex}
                                                        selectedItem={selectedItem}
                                                        setFullAppState={setFullAppState}
                                                    />
                                                );
                                            })}
                                            
                                        </Paper>
                                    ) 
                                    : null
                                }
                            </div>
                        );
                    }}
                </Downshift>
            </div>
        );
    }
}

PatientSearch.propTypes = {
    classes: PropTypes.object.isRequired,
    setFullAppState: PropTypes.func.isRequired,
    patient: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientSearch);
