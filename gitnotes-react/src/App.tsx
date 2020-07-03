import React from 'react';
import './App.css';
import EditorWrapper from './EditorWrapper/EditorWrapper';
import Login from './Login/Login';
import GithubWrapper from './services/GithubWrapper';

export type Props = {};

type State = {
    github: GithubWrapper;
    authorized: boolean;
};

export default class App extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            github: null,
            authorized: false,
        };

        // Bind callbacks
        this.login_callback = this.login_callback.bind(this);
    }

    /** Callback when logged in successfully to Github API */
    login_callback(token: string) {
        this.setState({ github: new GithubWrapper(token), authorized: true });
        console.log('User authorized');
        this.state.github.getRepos().then((repos) => {
            this.state.github.getRepoContents(repos[8]).then((contents) => {
                this.state.github.getDirContents(contents[10]).then((files) => {
                    this.state.github.getFile(files[1]);
                });
            });
        });
    }

    /**
     * JSX COMPONENTS
     */

    /** Login component */
    login() {
        return <Login login_callback={this.login_callback} />;
    }

    /** Main page component */
    main() {
        return <EditorWrapper />;
    }

    render() {
        return (
            <div className="App">
                {this.state.authorized ? this.main() : this.login()}
            </div>
        );
    }
}
