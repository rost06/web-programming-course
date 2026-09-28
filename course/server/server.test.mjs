import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from './server.mjs';

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try { await run(`http://127.0.0.1:${port}`); } finally { await new Promise((resolve) => server.close(resolve)); }
}
const request = (base, path, options = {}) => fetch(base + path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
const body = async (response) => response.json();
async function attempt(base) { const r = await request(base, '/api/attempts', { method: 'POST', body: JSON.stringify({ setId: 'web-basics' }) }); return body(r); }

test('valid flow grades training answers and hides keys', () => withServer(async (base) => {
  const set = await body(await request(base, '/api/sets/web-basics'));
  assert.equal(set.tasks[0].options.find((o) => o.id === 'b').label, '50');
  assert.ok(!JSON.stringify(set).includes('answer'));
  const a = await attempt(base);
  const saved = await request(base, `/api/attempts/${a.id}/answers/ts-1`, { method: 'PUT', body: JSON.stringify({ taskId: 'ts-1', kind: 'single-choice', optionId: 'b' }) });
  assert.equal(saved.status, 200);
  const result = await body(await request(base, `/api/attempts/${a.id}/submit`, { method: 'POST', body: '{}' }));
  assert.equal(result.status, 'graded'); assert.equal(result.score, 1); assert.equal(result.items[0].status, 'correct');
  const submitted = await body(await request(base, `/api/attempts/${a.id}`)); assert.deepEqual(Object.keys(submitted).sort(), ['answers', 'id', 'setId', 'status']);
}));

test('rejects invalid JSON body', () => withServer(async (base) => {
  const r = await request(base, '/api/attempts', { method: 'POST', body: '{' });
  assert.equal(r.status, 400); assert.equal((await body(r)).error.code, 'INVALID_BODY');
}));

test('submit is idempotent and locks changes', () => withServer(async (base) => {
  const a = await attempt(base); const first = await body(await request(base, `/api/attempts/${a.id}/submit`, { method: 'POST', body: '{}' }));
  const second = await body(await request(base, `/api/attempts/${a.id}/submit`, { method: 'POST', body: '{}' }));
  assert.deepEqual(second, first);
  const put = await request(base, `/api/attempts/${a.id}/answers/ts-1`, { method: 'PUT', body: JSON.stringify({ taskId: 'ts-1', kind: 'single-choice', optionId: 'b' }) });
  assert.equal(put.status, 409);
}));

test('PUT replaces and DELETE is repeatable', () => withServer(async (base) => {
  const a = await attempt(base); const url = `/api/attempts/${a.id}/answers/ts-2`;
  await request(base, url, { method: 'PUT', body: JSON.stringify({ taskId: 'ts-2', kind: 'single-choice', optionId: 'c' }) });
  await request(base, url, { method: 'PUT', body: JSON.stringify({ taskId: 'ts-2', kind: 'single-choice', optionId: 'a' }) });
  const deleted = await body(await request(base, url, { method: 'DELETE' })); assert.equal(deleted.answers.length, 0);
  const again = await request(base, url, { method: 'DELETE' }); assert.equal(again.status, 200);
}));

test('short text creates pending result', () => withServer(async (base) => {
  const a = await attempt(base);
  await request(base, `/api/attempts/${a.id}/answers/react-1`, { method: 'PUT', body: JSON.stringify({ taskId: 'react-1', kind: 'short-text', text: 'Объяснение' }) });
  const r = await body(await request(base, `/api/attempts/${a.id}/submit`, { method: 'POST', body: '{}' }));
  assert.equal(r.status, 'pending-review'); assert.equal(r.score, null); assert.equal(r.items.find((i) => i.taskId === 'react-1').score, null);
}));

test('demo failure has no mutation and includes CORS', () => withServer(async (base) => {
  const failed = await request(base, '/api/attempts', { method: 'POST', body: JSON.stringify({ setId: 'web-basics' }), headers: { Origin: 'http://localhost:5173', 'X-Demo-Fail': '1' } });
  assert.equal(failed.status, 500); assert.equal(failed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  const sets = await body(await request(base, '/api/sets')); assert.equal(sets[0].taskCount, 4);
}));
