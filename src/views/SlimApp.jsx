// React Imports:
import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
// Material UI components:
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// Application components:
import NavBar from '../nav/NavBar';
import ShortcutViewer from '../viewer/ShortcutViewer';
import FormList from '../forms/FormList';
// import FormSearch from '../forms/FormSearch';
// Shortcut Classes
import ProgressionShortcut from '../shortcuts/ProgressionShortcut';
import ToxicityShortcut from '../shortcuts/ToxicityShortcut';
// Lodash component
import Lang from 'lodash'

// Styling
import './SlimApp.css';

class SlimApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentShortcut: null
        };
    }

    /* 
     * Change the current shortcut to be the new type of shortcut  
     */
    changeShortcut = (shortcutType) => {
        if (Lang.isNull(shortcutType)) {
            this.setState({
                currentShortcut: null
            });
        } else {
            switch (shortcutType.toLowerCase()) {
                case "progression":
                    this.setState({
                        currentShortcut: new ProgressionShortcut(this.handleShortcutUpdate)
                    });
                    break;

                case "toxicity":
                    this.setState({
                        currentShortcut: new ToxicityShortcut(this.handleShortcutUpdate)
                    });
                    break;

                default:
                    console.error(`Error: Trying to change shortcut to ${shortcutType.toLowerCase()}, which is an invalid shortcut type`);
            }
        }
    }

    /* 
     * Change the current shortcut to be the new type of shortcut  
     */
    handleShortcutUpdate = (s) => {
        console.log(`Updated: ${s}`);
        (s !== "") && this.setState({currentShortcut: s});
    }

    render() {

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div className="SlimApp">
                    <NavBar title="Flux Notes Lite"/>
                    <Grid className="SlimApp-content" fluid>
                        <div id="forms-panel">
                                <Row center="xs">
                                    <Col className="no-padding" xs={3} >
                                        {/*No need for formsearch right now*/}
                                        {/*<FormSearch />*/}
                                        <FormList
                                            shortcuts={['Progression', 'Toxicity']}
                                            currentShortcut={this.state.currentShortcut}
                                            changeShortcut={this.changeShortcut}
                                        />
                                    </Col>
                                    <Col className="no-padding" xs={9}>
                                        <ShortcutViewer
                                            currentShortcut={this.state.currentShortcut}
                                            onShortcutUpdate={this.handleShortcutUpdate}
                                        />
                                    </Col>
                                </Row>
                        </div>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default SlimApp;
