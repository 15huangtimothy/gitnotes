import React from 'react';
import './EditorWrapper.css';
import Editor from 'rich-markdown-editor';
import GithubWrapper, { File } from '../services/GithubWrapper';

import { debounce } from 'lodash';

export type EditorProps = { file: File; github: GithubWrapper };

type EditorState = {
    dark: boolean;
    value: string;
};

export default class EditorWrapper extends React.Component<EditorProps, EditorState> {
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            dark: true, // get from user settings
            value: '',
        };
    }

    componentDidMount() {
        this.loadFile();
    }

    /** Load local markdown file */
    async loadFile() {
        // const file = require('../test.md');
        // await fetch(file)
        //     .then((response) => response.text())
        //     .then((result) => this.setState({ value: result }));
        if (this.props.file) {
            const file = await this.props.github.getFile(this.props.file);
            this.setState({ value: file });
            console.log(file);
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
        localStorage.setItem('saved', text);
    }, 250);

    handleUpdateValue = () => {
        const existing = localStorage.getItem('saved') || '';
        const value = `${existing}\n\nedit!`;
        localStorage.setItem('saved', value);
        this.setState({ value });
    };

    render() {
        const { body } = document;
        if (body) body.style.backgroundColor = this.state.dark ? '#181A1B' : '#FFF';
        return (
            <div className="EditorWrapper">
                <div className="toolbar">
                    <button type="button" onClick={this.handleToggleDark}>
                        {this.state.dark ? 'Light theme' : 'Dark theme'}
                    </button>{' '}
                    <button type="button" onClick={this.handleUpdateValue}>
                        Save
                    </button>
                </div>
                <Editor
                    value={this.state.value}
                    defaultValue="Hello world!"
                    onChange={this.handleChange}
                    dark={this.state.dark}
                    autoFocus
                />
            </div>
        );
    }
}
