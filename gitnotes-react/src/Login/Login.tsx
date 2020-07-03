import React from 'react';
import Axios from 'axios';

type LoginState = {
    status: string;
    token: string;
};

export default class Login extends React.Component<{}, LoginState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            status: 'unauthorized',
            token: null,
        };
    }

    componentDidMount() {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            this.setState({ status: 'loading' });

            Axios.get(process.env.REACT_APP_GATEKEEPER_URL + code).then((response) =>
                this.setState({
                    token: response.data.token,
                    status: 'loaded',
                })
            );
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <a
                    href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=repo%20read:user&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}`}
                >
                    Login
                </a>
                {this.state.status === 'loaded' && this.state.token ? (
                    <h1>SUCCESS</h1>
                ) : (
                    <h1>LOG IN</h1>
                )}
            </div>
        );
    }
}
