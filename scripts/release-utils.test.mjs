import test from 'node:test';
import assert from 'node:assert/strict';
import { redirectHtml } from './release-utils.mjs';

test('旧文章迁移到对应正文并保留查询和锚点，无脚本时仍有即时刷新及链接', () => {
  const target = 'https://mp2rss.bugcode.dev/docs/guide/subscription';
  const html = redirectHtml(target);
  assert.ok(html.includes(`href="${target}"`));
  assert.ok(html.includes('location.search+location.hash'));
  assert.ok(html.includes(`content="0;url=${target}"`));
  assert.ok(html.includes('rel="canonical"'));
});
test('迁移目标不接受其他域名', () => {
  assert.throws(() => redirectHtml('https://example.com/'), /Unexpected/);
});
