import Axios from 'axios';

export type Repo = {
    id: string;
    name: string;
    url: string;
};

export type Item = {
    name: string;
    path: string;
    sha: string;
    url: string;
    depth: number;
    type: string;
};

export interface Directory extends Item {
    contents: Array<Item>;
    type: 'dir';
}

export interface File extends Item {
    type: 'file';
}

/** Github API Wrapper for gitnotes*/
export default class GithubWrapper {
    private AUTH_STRING: string;

    constructor(github_token: string) {
        this.AUTH_STRING = 'Bearer '.concat(github_token);
    }

    /**
     * Get user's profile data
     */
    async getUser() {
        try {
            const res = await Axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: this.AUTH_STRING,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Get a list of a user's repositorys
     * Returns an array of Repo objects.
     */
    async getRepos() {
        try {
            const res = await Axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: this.AUTH_STRING,
                },
            });

            let repos = [];
            res.data.forEach((item) => {
                if (item.permissions.push && item.permissions.pull) {
                    repos.push({
                        id: item.id,
                        name: item.name,
                        url: item.url.split('?')[0],
                    } as Repo);
                }
            });
            return repos;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Get a list of contents in a specific repository
     * @param r: Repo object
     * Returbs array of JSON objects representing files and directories
     */
    async getRepoContents(r: Repo) {
        try {
            const res = await Axios.get(r.url + '/contents', {
                headers: {
                    Authorization: this.AUTH_STRING,
                },
            });
            let contents: Array<Item> = [];
            await this.processFileTree(res.data, contents, 0);
            return contents;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Processes items into File and Directory objects and appends to a given array of Files
     * @param data: Array of JSON objects containing files and directories
     */
    async processFileTree(data: Array<Item>, contents: Array<Item>, depth: number) {
        for (const item of data) {
            if (item.type === 'file') {
                contents.push({
                    name: item.name,
                    path: item.path,
                    sha: item.sha,
                    url: item.url.split('?')[0],
                    depth: depth,
                    type: 'file',
                } as File);
            } else if (item.type === 'dir') {
                // recursively process all subdirectories
                const f = await this.getDirContents(item.url);
                contents.push({
                    name: item.name,
                    path: item.path,
                    sha: item.sha,
                    url: item.url.split('?')[0],
                    depth: depth,
                    contents: await this.processFileTree(f, [], depth + 1),
                    type: 'dir',
                } as Directory);
            }
        }
        return contents;
    }

    /**
     * Returns a list of contents of a given directory
     * @param url: Directory URL
     */
    async getDirContents(url: string) {
        try {
            const res = await Axios.get(url, {
                headers: {
                    Authorization: this.AUTH_STRING,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Returns a string containing contents of a file
     * @param f: A File object
     */
    async getFile(f: File) {
        try {
            const res = await Axios.get(f.url, {
                headers: {
                    Authorization: this.AUTH_STRING,
                },
            });

            console.log(atob(res.data.content));
            return atob(res.data.content);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
