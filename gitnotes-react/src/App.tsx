import React from 'react';
import './App.css';
import EditorWrapper from './EditorWrapper/EditorWrapper';
import Login from './Login/Login';

export type Props = {};

type State = {};

export default class App extends React.Component<Props, State> {
    render() {
        return (
            <div className="App">
                <Login />
            </div>
        );
    }
}
