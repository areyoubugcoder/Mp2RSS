import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { redirectHtml, validateSite, walkFiles } from './release-utils.mjs';

const version = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(version)) throw new Error('Release version must be a full Git commit');
const dist = '.vitepress/dist';
const output = '.vitepress/pages';
rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, 'releases'), { recursive: true });
execFileSync('pnpm', ['build'], { stdio: 'inherit', env: { ...process.env, DOCS_BUILD_TARGET: 'main' } });
const pages = validateSite(dist);
writeFileSync(join(dist, 'release.json'), JSON.stringify({ version, pages: pages.length }) + '\n');
const archive = `site-${version}.tar.gz`;
execFileSync('tar', ['-czf', join(output, 'releases', archive), '-C', dist, '.'], { env: { ...process.env, COPYFILE_DISABLE: '1' } });
const bytes = readFileSync(join(output, 'releases', archive));
const manifest = { version, archive, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length, pages: pages.length };
writeFileSync(join(output, 'releases/latest.json'), JSON.stringify(manifest, null, 2) + '\n');

// 先发布可同步产物，主站验证成功后才启用旧站迁移，避免旧链接提前指向 404。
const migration = JSON.parse(readFileSync('publish-config.json', 'utf8'));
if (migration.legacyRedirects) {
  for (const page of pages) {
    const target = 'https://mp2rss.bugcode.dev/docs/' + page.replace(/index\.html$/, '').replace(/\.html$/, '');
    const file = join(output, page);
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, redirectHtml(target));
  }
  // 不存在的旧路径保持 404，不能把所有未知页面都重定向到首页。
  writeFileSync(join(output, '404.html'), '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="robots" content="noindex"><title>页面不存在</title><h1>页面不存在</h1><a href="https://mp2rss.bugcode.dev/docs/">打开 Mp2RSS 文档</a></html>');
  // 图片和机器摘要保留旧入口，避免外部文章的图片引用失效。
  for (const file of walkFiles(dist).filter(f => !f.endsWith('.html') && !['sitemap.xml', 'release.json', 'hashmap.json'].includes(f))) {
    const dest = join(output, file); mkdirSync(join(dest, '..'), { recursive: true }); cpSync(join(dist, file), dest);
  }
  cpSync(join(dist, 'sitemap.xml'), join(output, 'sitemap.xml'));
} else {
  execFileSync('pnpm', ['build'], { stdio: 'inherit', env: { ...process.env, DOCS_BUILD_TARGET: 'legacy', GOOGLE_ANALYTICS_ID: '' } });
  for (const file of readdirSync(dist)) cpSync(join(dist, file), join(output, file), { recursive: true });
}
console.log(JSON.stringify({ ...manifest, legacyRedirects: migration.legacyRedirects }));
