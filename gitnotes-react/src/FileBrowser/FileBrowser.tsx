import React from 'react';
import './FileBrowser.css';
import GithubWrapper, { Item, File, Directory, Repo } from '../services/GithubWrapper';
import { FileComponent, DirectoryComponent } from '../Item';
import {
    AppBar,
    Toolbar,
    Button,
    Menu,
    MenuItem,
    CircularProgress,
} from '@material-ui/core';

type FBProps = {
    files: Array<Item>;
    loadFiles: Function;
    github: GithubWrapper;
    loading: boolean;
    fileSelected: Function;
};

type FBState = {
    repoMenuAnchor: Element;
    repos_loaded: boolean;
    repos: Array<Repo>;
    repo_selected: Repo;
    selected: FileComponent;
};

export default class FileBrowser extends React.Component<FBProps, FBState> {
    constructor(props: FBProps) {
        super(props);
        this.state = {
            repoMenuAnchor: null,
            repos_loaded: false,
            repos: null,
            repo_selected: null,
            selected: null,
        };

        this.handleRepoMenuOpen = this.handleRepoMenuOpen.bind(this);
        this.getRepos = this.getRepos.bind(this);
        this.handleRepoMenuClose = this.handleRepoMenuClose.bind(this);
        this.handleRepoSelect = this.handleRepoSelect.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    handleRepoMenuOpen(e: any) {
        if (!this.state.repos) {
            this.getRepos();
        } else {
            this.setState({ repos_loaded: true });
        }
        this.setState({ repoMenuAnchor: e.currentTarget });
    }

    async getRepos() {
        console.log('fetching repos');
        const repos = await this.props.github.getRepos();
        this.setState({ repos: repos, repos_loaded: true });
    }

    handleRepoMenuClose() {
        this.setState({ repoMenuAnchor: null, repos_loaded: false });
    }

    handleRepoSelect(e: any) {
        // close current file
        if (this.state.selected) {
            this.state.selected.toggleSelected();
        }
        this.setState({ selected: null });
        this.props.fileSelected(null);

        const index: number = e.currentTarget.getAttribute('data-key');
        const repo_selected: Repo = this.state.repos[index];
        this.props.loadFiles(repo_selected);
        this.setState({ repo_selected });
        this.handleRepoMenuClose();
    }

    async handleFileSelect(f: File, fc: FileComponent) {
        if (this.state.selected) {
            this.state.selected.toggleSelected();
        }
        fc.toggleSelected();
        this.setState({ selected: fc });
        this.props.fileSelected(f);
    }

    /**** JSX FRAGMENTS ****/
    repoMenu() {
        return (
            <React.Fragment>
                <Button
                    className="repo-btn"
                    variant="contained"
                    onClick={this.handleRepoMenuOpen}
                >
                    {this.state.repo_selected
                        ? this.state.repo_selected.name
                        : 'Choose Repository'}
                    <i className="fa fa-caret-down" aria-hidden="true"></i>
                </Button>
                {this.state.repos_loaded && (
                    <Menu
                        id="repo-menu"
                        anchorEl={this.state.repoMenuAnchor}
                        keepMounted
                        open={this.state.repos_loaded}
                        onClose={this.handleRepoMenuClose}
                    >
                        {this.state.repos.map((r, index) => (
                            <MenuItem
                                key={index}
                                data-key={index}
                                className="repo-menu-item"
                                onClick={this.handleRepoSelect}
                            >
                                {r.name}
                            </MenuItem>
                        ))}
                    </Menu>
                )}
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <AppBar position="sticky" id="fb-appbar">
                    <Toolbar variant="dense">{this.repoMenu()}</Toolbar>
                </AppBar>
                <CircularProgress
                    className={
                        'fb-progress ' +
                        (this.props.loading ? 'progress-show' : 'progress-hide')
                    }
                    size={'2em'}
                />
                {this.props.files && (
                    <DirectoryComponent
                        name="root"
                        path="/"
                        sha="root"
                        url="/"
                        depth={-1}
                        contents={this.props.files}
                        root
                        handleFileSelect={this.handleFileSelect}
                    />
                )}
            </React.Fragment>
        );
    }
}
