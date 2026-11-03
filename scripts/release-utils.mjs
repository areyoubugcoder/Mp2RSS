import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function walkFiles(root, prefix = '') {
  return readdirSync(join(root, prefix), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walkFiles(root, join(prefix, e.name)) : [join(prefix, e.name)]);
}

export function redirectHtml(target) {
  if (!target.startsWith('https://mp2rss.bugcode.dev/docs/')) throw new Error('Unexpected redirect host');
  const escaped = target.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>Mp2RSS 文档已迁移</title><link rel="canonical" href="${escaped}"><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script><meta http-equiv="refresh" content="0;url=${escaped}"></head><body><p>本文已迁移至主站，<a href="${escaped}">打开对应文档</a>。</p></body></html>`;
}

export function validateSite(root) {
  const pages = walkFiles(root).filter(f => f.endsWith('.html') && f !== '404.html');
  if (!pages.includes('index.html') || !pages.includes('cli/first-delivery.html')) throw new Error('Missing required pages');
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  if (sitemap.includes('areyoubugcoder.github.io') || !sitemap.includes('https://mp2rss.bugcode.dev/docs/')) throw new Error('Invalid sitemap origin');
  for (const page of pages) {
    const html = readFileSync(join(root, page), 'utf8');
    const canonical = 'https://mp2rss.bugcode.dev/docs/' + page.replace(/index\.html$/, '').replace(/\.html$/, '');
    if (!html.includes(`rel="canonical" href="${canonical}"`) || !html.includes('<h1')) throw new Error(`Missing canonical or rendered content: ${page}`);
    for (const match of html.matchAll(/(?:href|src)="(\/docs\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
      const path = decodeURIComponent(match[1].slice('/docs/'.length));
      const candidates = [path, path + '.html', join(path, 'index.html')];
      if (!candidates.some(p => existsSync(join(root, p)))) throw new Error(`Broken local link ${match[1]} in ${page}`);
    }
  }
  return pages;
}
