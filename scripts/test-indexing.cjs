const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');

function load(file, mocks = {}) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = module.paths;
  mod.require = (id) => {
    if (id in mocks) return mocks[id];
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`, mocks);
    return require(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
  return mod.exports;
}

async function main() {
  const helpers = load('src/lib/sitemap-helpers.ts', {
    '@/lib/dbConnect': { default: { query: async () => { throw new Error('Database unavailable'); } } },
  });
  const categories = [{ slug: 'cleaning' }, { slug: 'plumbing' }];
  const cities = Array.from({ length: 10001 }, (_, i) => ({ state_slug: 'qld', slug: `city-${i}` }));
  const first = helpers.serviceLocationEntries(categories, cities, 0);
  const second = helpers.serviceLocationEntries(categories, cities, 1);
  assert.equal(first.length, 20000);
  assert.equal(second.length, 2);
  assert.equal(new Set([...first, ...second].map(x => x.loc)).size, 20002);
  assert.equal(second[1].loc, 'https://www.taskoria.com/services/plumbing/qld/city-10000');
  assert.deepEqual(helpers.serviceLocationEntries(categories, [], 0), []);
  const xml = helpers.buildUrlsetXml([{ loc: 'https://www.taskoria.com/?a=1&b=2', changefreq: 'weekly', priority: 0.7 }]);
  assert.match(xml, /a=1&amp;b=2/);
  const originalError = console.error;
  console.error = () => {};
  try {
    await assert.rejects(helpers.fetchCategories, /Database unavailable/);
    await assert.rejects(helpers.fetchCities, /Database unavailable/);
    await assert.rejects(helpers.fetchProviderProfiles, /Database unavailable/);
  } finally { console.error = originalError; }
  const mocks = { '@/lib/sitemap-helpers': {
    ...helpers, fetchServiceSitemapData: async () => ({ categories, cities }),
  }};
  const route = load('src/app/sitemaps/service-locations/[slug]/route.ts', mocks);
  for (const slug of ['-1.xml', '01.xml', 'junk.xml', '2.xml']) {
    assert.equal((await route.GET(null, { params: Promise.resolve({ slug }) })).status, 404);
  }
  assert.equal((await route.GET(null, { params: Promise.resolve({ slug: '1.xml' }) })).status, 200);
  const index = load('src/app/sitemap.xml/route.ts', mocks);
  const body = await (await index.GET()).text();
  for (const name of ['categories.xml', 'cities.xml', 'provider-profiles.xml', 'cost-guides.xml']) assert.ok(body.includes(name));
  assert.ok(!body.includes('service-locations/'));
  assert.ok(body.includes('/sitemaps/categories_1.xml'));
  assert.ok(body.includes('/sitemaps/categories_2.xml'));
  assert.ok(!body.includes('/sitemaps/categories_3.xml'));
  const categoryRoute = load('src/app/sitemaps/[slug]/route.ts', mocks);
  for (const slug of ['categories_0.xml', 'categories_01.xml', 'categories_3.xml', 'junk.xml']) {
    assert.equal((await categoryRoute.GET(null, { params: Promise.resolve({ slug }) })).status, 404);
  }
  const lastChunk = await categoryRoute.GET(null, { params: Promise.resolve({ slug: 'categories_2.xml' }) });
  assert.equal(lastChunk.status, 200);
  assert.equal((await lastChunk.text()).match(/<loc>/g).length, 2);

  const { default: worker } = await import('../cloudflare-worker/src/index.mjs');
  const originalFetch = global.fetch;
  global.fetch = async () => new Response('Public page', { status: 200 });
  try {
    for (const country of ['US', 'AU', 'NP', 'GB']) {
      const request = new Request('https://www.taskoria.com/services/cleaning', { headers: { Accept: 'text/html' } });
      request.cf = { country };
      const response = await worker.fetch(request);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('X-Robots-Tag'), null);
    }
    const redirect = await worker.fetch(new Request('https://taskoria.com/services/cleaning?q=a'));
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get('Location'), 'https://www.taskoria.com/services/cleaning?q=a');
  } finally { global.fetch = originalFetch; }
  console.log('Indexing checks passed: sitemap coverage, chunk boundaries, XML escaping, database failures, invalid chunks, worldwide access, canonical redirect.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
