import React from 'react';
import './App.css';
import EditorWrapper from './EditorWrapper/EditorWrapper';
import Login from './Login/Login';
import GithubWrapper, { Item, Directory, File } from './services/GithubWrapper';
import FileBrowser from './FileBrowser/FileBrowser';
import Split from 'react-split';

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
        return <Login login_callback={this.loginCallback} />;
    }

    /** Main page component */
    main() {
        // return <EditorWrapper />;
        return (
            <Split
                sizes={[15, 85]}
                minSize={[perc2pix(12), perc2pix(25)]}
                gutterSize={5}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
            >
                <div className="split" id="panel1">
                    <FileBrowser files={this.state.files} />
                </div>
                <div className="split" id="panel2">
                    <EditorWrapper />
                </div>
            </Split>
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

const perc2pix = (perc) => {
    return (window.innerWidth * perc) / 100;
};
