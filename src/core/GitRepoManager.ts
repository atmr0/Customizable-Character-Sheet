import GitHubClient from './GitHubClient';

export type GitSettings = {
  owner: string;
  repo: string;
  branch?: string;
  token?: string;
};

export default class GitRepoManager {
  owner: string;
  repo: string;
  branch: string;
  token: string;

  constructor(defaults: Partial<GitSettings> = {}) {
    this.owner = sessionStorage.getItem('gitOwner') || defaults.owner || '';
    this.repo = sessionStorage.getItem('gitRepo') || defaults.repo || '';
    this.branch = sessionStorage.getItem('gitBranch') || defaults.branch || 'main';
    this.token = sessionStorage.getItem('gitToken') || defaults.token || '';
  }

  getSettings(): GitSettings {
    return { owner: this.owner, repo: this.repo, branch: this.branch, token: this.token };
  }

  saveSettings(s: GitSettings) {
    this.owner = s.owner || '';
    this.repo = s.repo || '';
    this.branch = s.branch || 'main';
    this.token = s.token || '';
    sessionStorage.setItem('gitOwner', this.owner);
    sessionStorage.setItem('gitRepo', this.repo);
    sessionStorage.setItem('gitBranch', this.branch);
    sessionStorage.setItem('gitToken', this.token);
  }

  async saveSheet(path: string, contentObj: any, message = 'Update file') {
    if (!this.owner || !this.repo || !this.token) throw new Error('Git settings incomplete');
    const client = new GitHubClient({ owner: this.owner, repo: this.repo, branch: this.branch, token: this.token });
    return client.createOrUpdateFile(path, contentObj, message);
  }
}
