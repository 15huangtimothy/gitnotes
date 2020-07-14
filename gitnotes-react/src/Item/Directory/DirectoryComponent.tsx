import React from 'react';
import { Item, File, Directory } from '../../services/GithubWrapper';
import ItemComponent, { ItemProps } from '../ItemComponent';
import FileComponent from '../File/FileComponent';

export interface DirProps extends ItemProps {
    contents: Array<Item>;
    root: boolean;
}

type DirState = {
    open: boolean;
};

export default class DirectoryComponent extends ItemComponent<DirProps, DirState> {
    constructor(props: DirProps) {
        super(props);

        this.state = { open: this.props.root }; // root default open, other directoreis default closed

        this.toggleOpen = this.toggleOpen.bind(this);
        this.processFiles = this.processFiles.bind(this);
    }

    /** Toggle when directory is open/close */
    toggleOpen() {
        this.setState({ open: !this.state.open });
    }

    /** Returns a JSX File */
    createFile(item: File) {
        return (
            <FileComponent
                name={item.name}
                path={item.path}
                sha={item.sha}
                url={item.url}
                depth={item.depth}
                key={item.path}
                file={item}
                handleFileSelect={this.props.handleFileSelect}
            />
        );
    }

    /** Returns a JSX Directory */
    createDir(item: Directory) {
        return (
            <DirectoryComponent
                name={item.name}
                path={item.path}
                sha={item.sha}
                url={item.url}
                depth={item.depth}
                contents={item.contents}
                key={item.path}
                root={false}
                handleFileSelect={this.props.handleFileSelect}
            />
        );
    }

    /** Returns a JSX File or Directory object depending on the input Item's type */
    processFiles(item: Item) {
        if (item.type === 'file') {
            return this.createFile(item as File);
        } else if (item.type === 'dir') {
            return this.createDir(item as Directory);
        }
    }

    /** Return a list of JSX objects represents all of this directory's contents */
    showContents() {
        return <div>{this.state.open && this.props.contents.map(this.processFiles)}</div>;
    }

    render() {
        if (this.props.root) {
            return this.showContents();
        }
        return (
            <div className="dir item" key={this.props.path}>
                <div onClick={this.toggleOpen}>
                    {this.state.open ? (
                        <i className="fa fa-folder-open" aria-hidden="true"></i>
                    ) : (
                        <i className="fa fa-folder" aria-hidden="true"></i>
                    )}
                    {this.props.name}
                </div>
                <div style={{ paddingLeft: this.props.depth * 0.5 + 0.5 + 'em' }}>
                    {this.showContents()}
                </div>
            </div>
        );
    }
}
