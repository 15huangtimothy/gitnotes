import React from 'react';
import './EditorWrapper.css';
import Editor from 'rich-markdown-editor';
import GithubWrapper, { File } from '../services/GithubWrapper';
import { AppBar, BottomNavigation, Button } from '@material-ui/core';

import { debounce } from 'lodash';

export type EditorProps = {
    file: File;
    github: GithubWrapper;
};

type EditorState = {
    dark: boolean;
    value: string;
};

export default class EditorWrapper extends React.Component<EditorProps, EditorState> {
    content: string = '';
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            dark: true, // get from user settings
            value: '',
        };

        this.handleUpdateValue = this.handleUpdateValue.bind(this);
    }

    componentDidMount() {
        this.loadFile();
    }

    /** Load file */
    async loadFile() {
        // const file = require('../test.md');
        // await fetch(file)
        //     .then((response) => response.text())
        //     .then((result) => this.setState({ value: result }));
        if (this.props.file) {
            console.log(this.props.file);
            const file = await this.props.github.getFile(this.props.file);
            this.setState({ value: file });
            this.content = file;
            console.log('file loaded');
        }
    }

    /** Toggles light/dark theme */
    handleToggleDark = () => {
        const dark = !this.state.dark;
        this.setState({ dark });
        // update user settings
    };

    /** Handles when editor text changes */
    handleChange = debounce((value: any) => {
        const text = value();
        console.log(text);
        // localStorage.setItem('saved', text);
        this.content = text;
    }, 250);

    handleUpdateValue = () => {
        console.log(this.props.file);
        // const existing = localStorage.getItem('saved') || '';
        // const value = `${existing}\n\nedit!`;
        // localStorage.setItem('saved', value);
        // this.setState({ value });
    };

    async handleCommit() {
        const res = await this.props.github.commitFile(this.props.file, this.content);
        console.log('committed');
    }

    render() {
        const { body } = document;
        if (body) body.style.backgroundColor = this.state.dark ? '#181A1B' : '#FFF';
        return (
            <div className="EditorWrapper">
                {/* <div className="toolbar">
                    <button type="button" onClick={this.handleToggleDark}>
                        {this.state.dark ? 'Light theme' : 'Dark theme'}
                    </button>{' '}
                    <button type="button" onClick={this.handleUpdateValue}>
                        Save
                    </button>
                </div> */}
                <Editor
                    value={this.state.value}
                    defaultValue=""
                    onChange={this.handleChange}
                    dark={this.state.dark}
                    autoFocus
                />
                <Button
                    className="commit-btn"
                    variant="contained"
                    onClick={() => {
                        this.handleCommit();
                    }}
                >
                    Commit
                </Button>
            </div>
        );
    }
}
