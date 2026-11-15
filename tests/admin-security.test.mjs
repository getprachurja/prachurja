import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('unconfigured portals do not impersonate an administrator', async () => {
  const route = await read('app/[...slug]/page.tsx');
  assert.doesNotMatch(route, /admin@prachurja\.local|localAdminPreview/);
  assert.match(route, /Workspace setup required/);
  assert.match(route, /requireChatGPTUser/);
  assert.match(route, /canAccessPortal/);
});

test('API errors do not return internal exception messages', async () => {
  const source = await read('lib/api-utils.ts');
  assert.doesNotMatch(source, /error\.message/);
  assert.match(source, /error: fallback/);
});

test('access gate signs out through the implemented POST endpoint', async () => {
  const source = await read('components/portal-access-gate.tsx');
  assert.doesNotMatch(source, /signout-with-chatgpt/);
  assert.equal((source.match(/action="\/auth\/signout" method="post"/g) ?? []).length, 2);
});

test('health endpoint does not claim an untested storage check', async () => {
  assert.match(await read('app/api/health/route.ts'), /storage: "not_checked"/);
});
