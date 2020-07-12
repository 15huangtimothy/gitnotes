import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';

export type LoginProps = {
    status: string;
};

export default class Login extends React.Component<LoginProps, {}> {
    render() {
        return (
            <React.Fragment>
                <Button
                    className={
                        'login-btn ' +
                        (this.props.status === 'loading' && 'login-btn-disabled')
                    }
                    variant="contained"
                    href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=repo%20read:user&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}`}
                >
                    <i className="fa fa-github"></i>
                    Sign in with GitHub
                    <CircularProgress
                        className={
                            this.props.status === 'loading'
                                ? 'progress-show'
                                : 'progress-hide'
                        }
                        size={'1.6em'}
                    />
                </Button>

                {this.props.status === 'error' && (
                    <h4 id="login-error">Login error. Try again</h4>
                )}
            </React.Fragment>
        );
    }
}
