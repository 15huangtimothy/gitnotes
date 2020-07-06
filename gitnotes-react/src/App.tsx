import React from 'react';
import './App.css';
import EditorWrapper from './EditorWrapper/EditorWrapper';
import Login from './Login/Login';
import GithubWrapper from './services/GithubWrapper';
import NestedFileBrowser from './FileBrowser/FileBrowser';

export type Props = {};

type State = {
    github: GithubWrapper;
    authorized: boolean;
    files: Array<any>;
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
        return <NestedFileBrowser files={this.state.files} />;
    }

    render() {
        return (
            <div className="App">
                {this.state.authorized && this.state.files ? this.main() : this.login()}
            </div>
        );
    }
}
