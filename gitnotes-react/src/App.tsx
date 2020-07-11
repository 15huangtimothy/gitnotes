import React from 'react';
import EditorWrapper from './EditorWrapper/EditorWrapper';
import Login from './Login/Login';
import GithubWrapper, { Item, Directory, File } from './services/GithubWrapper';
import FileBrowser from './FileBrowser/FileBrowser';
import Split from 'react-split';
import { AppBar, Toolbar, Container } from '@material-ui/core';
import './App.css';

export type Props = {};

type State = {
    github: GithubWrapper;
    authorized: boolean;
    files: Array<Item>;
};

export default class App extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            github: null,
            authorized: false,
            files: null,
        };

        // Bind callbacks
        this.loginCallback = this.loginCallback.bind(this);
    }

    /** Callback when logged in successfully to Github API */
    loginCallback(token: string) {
        this.setState({ github: new GithubWrapper(token), authorized: true });
        console.log('User authorized');
        this.loadFiles();
    }

    async loadFiles() {
        const repos = await this.state.github.getRepos();
        const files = await this.state.github.getRepoContents(repos[8]);
        this.setState({
            files: files,
        });
    }

    /**
     * JSX COMPONENTS
     */

    /** Login component */
    login() {
        return (
            <React.Fragment>
                <Container maxWidth="md" className="hero">
                    <h1>GitNotes</h1>
                    <h3>A browser-based Github-integrated digital markdown notebook</h3>
                    <Login login_callback={this.loginCallback} />
                </Container>
            </React.Fragment>
        );
    }

    /** Main page component */
    main() {
        // return <EditorWrapper />;
        return (
            <React.Fragment>
                <AppBar position="static" className="appbar">
                    <Toolbar variant="dense">
                        <h3>GitNotes</h3>
                    </Toolbar>
                </AppBar>
                <Split
                    sizes={[15, 85]}
                    minSize={[perc2pix(15), perc2pix(25)]}
                    gutterSize={5}
                    dragInterval={1}
                    direction="horizontal"
                    cursor="col-resize"
                >
                    <div className="split" id="filebrowser">
                        <AppBar position="static" className="appbar">
                            <Toolbar variant="dense">
                                <h2>Portfolio</h2>
                            </Toolbar>
                        </AppBar>
                        <FileBrowser files={this.state.files} />
                    </div>
                    <div className="split" id="editor">
                        <EditorWrapper />
                    </div>
                </Split>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="App">
                {this.state.authorized && this.state.files ? this.main() : this.login()}
            </div>
        );
    }
}

/*
UTILITY FUNCTIONS
*/
const perc2pix = (perc) => {
    return (window.innerWidth * perc) / 100;
};
