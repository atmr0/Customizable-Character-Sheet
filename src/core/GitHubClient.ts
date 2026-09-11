type GetFileResult = { ok: true; sha?: string; content?: string; json?: any } | { ok: false; status: number; message?: string };
    
function safeStringify(obj: unknown, space = 2) {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
    if (typeof value === 'symbol') return value.toString();
    if (typeof Node !== 'undefined' && value instanceof Node) return `[Node: ${value && (value as any).nodeName}]`;
    if (value && typeof value === 'object') {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  }, space);
}

export default class GitHubClient {
  owner: string;
  repo: string;
  branch: string;
  token: string;

  constructor(opts: { owner: string; repo: string; branch?: string; token?: string }) {
    this.owner = opts.owner;
    this.repo = opts.repo;
    this.branch = opts.branch || 'main';
    this.token = opts.token || '';
  }

  private get headers() {
    const h: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (this.token) h['Authorization'] = `token ${this.token}`;
    return h;
  }

  private jsonToBase64(obj: any) {
    const str = safeStringify(obj, 2);
    if (typeof window !== 'undefined' && (window as any).btoa) {
      return btoa(unescape(encodeURIComponent(str)));
    }
    // Node
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const b = Buffer.from(str, 'utf8');
    return b.toString('base64');
  }

  private stringToBase64(str: string) {
    if (typeof window !== 'undefined' && (window as any).btoa) {
      return btoa(unescape(encodeURIComponent(str)));
    }
    // Node
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return Buffer.from(str, 'utf8').toString('base64');
  }

  /**
   * Commit a single file (create or update) using the Contents API.
   * Mirrors the example: PUT to /repos/:owner/:repo/contents/:path
   * Returns the API response JSON on success.
   */
  async commitSingleFile(path: string, content: string | object, message = 'Update file', sha?: string) {
    const contentBase64 = typeof content === 'string' ? this.stringToBase64(content) : this.jsonToBase64(content);
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(path)}`;
    const body: any = { message, content: contentBase64, branch: this.branch };
    if (sha) body.sha = sha;

    const headers = { ...this.headers, 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' };
    const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Status ${res.status}`);
    }
    return await res.json();
  }

  async getFile(path: string): Promise<GetFileResult> {
    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${encodeURIComponent(path)}?ref=${this.branch}`;
      const res = await fetch(url, { headers: this.headers });
      if (res.status === 404) return { ok: false, status: 404, message: 'Not found' };
      if (!res.ok) return { ok: false, status: res.status, message: await res.text() };
      const j = await res.json();
      return { ok: true, sha: j.sha, content: j.content, json: j };
    } catch (err: any) {
      return { ok: false, status: 0, message: err?.message || String(err) };
    }
  }

  async createOrUpdateFile(path: string, contentObj: any, message = 'Update file') {
    // Use commitSingleFile after resolving existing sha (if any)
    const clientGet = await this.getFile(path);
    let sha: string | undefined;
    if (clientGet.ok && clientGet.sha) sha = clientGet.sha;
    return this.commitSingleFile(path, contentObj, message, sha);
  }
}
