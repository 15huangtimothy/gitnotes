import React from 'react';
import ItemComponent, { ItemProps } from '../ItemComponent';

export interface FileProps extends ItemProps {}

export default class FileComponent extends ItemComponent<FileProps, {}> {
    constructor(props: FileProps) {
        super(props);
    }

    render() {
        return (
            <div className="file item" key={this.props.path}>
                <i className="fa fa-file" aria-hidden="true"></i>
                {this.props.name}
            </div>
        );
    }
}
