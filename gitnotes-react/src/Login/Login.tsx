import React from 'react';
import Axios from 'axios';
import { Button } from '@material-ui/core';

export type LoginProps = {
    login_callback: Function;
};

type LoginState = {
    status: string;
};

export default class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            status: 'unauthorized',
        };
    }

    componentDidMount() {
        this.authGitHub();
    }

    /** Send Gatekeeper request to get Github OAuth token */
    async authGitHub() {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            let response = await Axios.get(process.env.REACT_APP_GATEKEEPER_URL + code);
            window.history.pushState({}, document.title, '/'); // remove github token from url

            if (response.data.token) {
                this.setState({ status: 'authorized' });
                console.log('Login successful');
                this.props.login_callback(response.data.token);
            } else {
                this.setState({ status: 'error' });
                console.log('Login error');
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    className="login-btn"
                    variant="contained"
                    href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=repo%20read:user&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}`}
                >
                    <i className="fa fa-github"></i>
                    Sign in with GitHub
                </Button>

                {this.state.status === 'error' && <h2>Login error. Try again</h2>}
                {this.state.status === 'authorized' && <h2>Login successful</h2>}
            </React.Fragment>
        );
    }
}
