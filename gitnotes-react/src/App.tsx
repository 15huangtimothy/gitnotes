import React from 'react';
import Axios from 'axios';
import EditorWrapper from './EditorWrapper/EditorWrapper';
import Login from './Login/Login';
import GithubWrapper, { Item, Directory, File, Repo } from './services/GithubWrapper';
import FileBrowser from './FileBrowser/FileBrowser';
import { FileComponent } from './Item';
import Split from 'react-split';
import { AppBar, Toolbar, Container } from '@material-ui/core';
import './App.css';

export type Props = {};

type State = {
    github: GithubWrapper;
    authorization_status: string;
    files: Array<Item>;
    loading_files: boolean;
    selected_file: File;
};

export default class App extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            github: null,
            authorization_status: 'unauthorized',
            files: null,
            loading_files: false,
            selected_file: null,
        };

        this.loadFiles = this.loadFiles.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
    }

    componentDidMount() {
        this.authGitHub();
    }

    /** Send Gatekeeper request to get Github OAuth token */
    async authGitHub() {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            this.setState({ authorization_status: 'loading' });
            let response = await Axios.get(process.env.REACT_APP_GATEKEEPER_URL + code);
            window.history.pushState({}, document.title, '/'); // remove github token from url

            if (response.data.token) {
                this.setState({
                    github: new GithubWrapper(response.data.token),
                });
                console.log('User authorized');
                this.setState({ authorization_status: 'authorized' });
            } else {
                this.setState({ authorization_status: 'error' });
                console.log('Login error');
            }
        }
    }

    async loadFiles(repo: Repo) {
        this.setState({
            files: null,
            loading_files: true,
        });
        const files = await this.state.github.getRepoContents(repo);
        this.setState({
            files: files,
            loading_files: false,
        });
        // const repos = await this.state.github.getRepos();
        // const files = await this.state.github.getRepoContents(repos[8]);
        // this.setState({
        //     files: files,
        // });
    }

    fileSelected(f: File) {
        this.setState({ selected_file: f });
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
                    <Login status={this.state.authorization_status} />
                </Container>
            </React.Fragment>
        );
    }

    /** Main page component */
    main() {
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
                        <FileBrowser
                            files={this.state.files}
                            loadFiles={this.loadFiles}
                            github={this.state.github}
                            loading={this.state.loading_files}
                            fileSelected={this.fileSelected}
                        />
                    </div>
                    <div className="split" id="editor">
                        <EditorWrapper
                            key={this.state.selected_file && this.state.selected_file.sha}
                            file={this.state.selected_file}
                            github={this.state.github}
                        />
                    </div>
                </Split>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="App">
                {this.state.authorization_status === 'authorized'
                    ? this.main()
                    : this.login()}
            </div>
        );
    }
}

/*
UTILITY FUNCTIONS
*/
const perc2pix = (perc: number) => {
    return (window.innerWidth * perc) / 100;
};
