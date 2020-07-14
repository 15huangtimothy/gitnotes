import React from 'react';
import { File } from '../../services/GithubWrapper';
import ItemComponent, { ItemProps } from '../ItemComponent';

export interface FileProps extends ItemProps {
    file: File;
}

interface FileState {
    selected: boolean;
}

export default class FileComponent extends ItemComponent<FileProps, FileState> {
    constructor(props: FileProps) {
        super(props);
        this.state = { selected: false };

        this.toggleSelected = this.toggleSelected.bind(this);
        this.getFile = this.getFile.bind(this);
    }

    toggleSelected() {
        this.setState({ selected: !this.state.selected });
    }

    getFile() {
        return this.props.file;
    }

    render() {
        return (
            <div
                className="file item"
                key={this.props.path}
                onClick={() => {
                    this.props.handleFileSelect(this.props.file, this);
                }}
            >
                <i className="fa fa-file" aria-hidden="true"></i>
                <p className={this.state.selected ? 'selected' : ''}>{this.props.name}</p>
            </div>
        );
    }
}
