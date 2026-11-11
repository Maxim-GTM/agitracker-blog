// Cloudflare cron Worker: every 30 minutes it runs the news pipeline and, when something
// changed, commits the data files to the site repo in ONE commit through the GitHub API.
// The push triggers the site's normal Cloudflare build and deploy, so git stays the source
// of truth and the static pages are rebuilt with the new headlines.
//
// Secret:  GITHUB_TOKEN  (fine-grained PAT, this repo only, "Contents: Read and write")
// Vars:    GITHUB_REPO ("owner/name"), GITHUB_BRANCH
import { runPipeline } from '../../scripts/news-pipeline.mjs';

const DATA = 'src/data/news';

const gh = (env, path, init = {}) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'agitracker-news-cron',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

async function ghJson(env, path, init) {
  const res = await gh(env, path, init);
  if (!res.ok) throw new Error(`GitHub ${init?.method ?? 'GET'} ${path.split('?')[0]} -> ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

/** Raw file at a specific commit; `fallback` when it does not exist yet. */
async function readFile(env, sha, name, fallback) {
  const res = await gh(env, `/contents/${DATA}/${name}?ref=${sha}`, { headers: { Accept: 'application/vnd.github.raw+json' } });
  if (res.status === 404) return fallback;
  if (!res.ok) throw new Error(`GitHub read ${name} -> ${res.status}`);
  return JSON.parse(await res.text());
}

async function refresh(env) {
  const started = Date.now();
  if (!env.GITHUB_TOKEN) {
    // Dry mode: proves the pipeline runs in this runtime, commits nothing.
    console.warn('GITHUB_TOKEN is not set: dry run only, nothing will be committed.');
    const { default: sources } = await import('../../src/data/news/sources.json');
    const r = await runPipeline({ sources, prev: { items: [] }, prevStatus: {}, frozenKeys: new Set() });
    console.log(r.log.join('\n'));
    return;
  }

  const branch = env.GITHUB_BRANCH || 'main';
  const head = (await ghJson(env, `/git/ref/heads/${branch}`)).object.sha;
  const [sources, prev, prevStatus, weeks] = await Promise.all([
    readFile(env, head, 'sources.json', []),
    readFile(env, head, 'items.json', { updatedAt: null, items: [] }),
    readFile(env, head, 'status.json', { coverageStart: null, updatedAt: null, sources: {} }),
    gh(env, `/contents/${DATA}/weeks?ref=${head}`).then((r) => (r.ok ? r.json() : [])),
  ]);
  const frozenKeys = new Set(weeks.filter((f) => f.name.endsWith('.json')).map((f) => f.name.slice(0, -5)));

  const { ok, log, files } = await runPipeline({ sources, prev, prevStatus, frozenKeys });
  console.log(log.join('\n'));
  if (!ok) throw new Error('Pipeline refused to write (too few feeds reachable).');
  const names = Object.keys(files);
  if (names.length === 0) {
    console.log(`No changes (${Date.now() - started} ms).`);
    return;
  }

  const baseTree = (await ghJson(env, `/git/commits/${head}`)).tree.sha;
  const tree = await ghJson(env, '/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTree,
      tree: names.map((name) => ({ path: `${DATA}/${name}`, mode: '100644', type: 'blob', content: files[name] })),
    }),
  });
  const commit = await ghJson(env, '/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: `Refresh AI news (${names.filter((n) => n.startsWith('weeks/')).length ? 'new weekly brief' : 'headlines'})`,
      tree: tree.sha,
      parents: [head],
    }),
  });
  // Not forced: if main moved while we worked, this fails and the next run starts from the new head.
  await ghJson(env, `/git/refs/heads/${branch}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
  console.log(`Committed ${commit.sha.slice(0, 7)}: ${names.join(', ')} (${Date.now() - started} ms).`);
}

export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      refresh(env).catch((err) => {
        console.error(`News refresh failed: ${err?.message ?? err}`);
        throw err;
      }),
    );
  },
  // No public surface: workers.dev is disabled and this answers nothing useful.
  fetch: () => new Response('Not found', { status: 404 }),
};
