import React from 'react';
import { Item, File, Directory } from '../services/GithubWrapper';
import { FileComponent, DirectoryComponent } from '../Item';
import { AppBar, Toolbar } from '@material-ui/core';

type FBProps = {
    files: Array<Item>;
};

type FBState = { files: Array<Item> };

export default class FileBrowser extends React.Component<FBProps, FBState> {
    constructor(props: FBProps) {
        super(props);
        this.state = { files: this.props.files };
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position="sticky" className="fb-appbar">
                    <Toolbar variant="dense">
                        <h2>Portfolio</h2>
                    </Toolbar>
                </AppBar>
                <DirectoryComponent
                    name="root"
                    path="/"
                    sha="root"
                    url="/"
                    depth={-1}
                    contents={this.props.files}
                    root
                />
            </React.Fragment>
        );
    }
}
