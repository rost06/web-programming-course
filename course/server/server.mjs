import { createServer as createHttpServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/training-set.json');
const BODY_LIMIT = 64 * 1024;
const PORT = 3001;

const trainingSet = JSON.parse(await readFile(DATA_PATH, 'utf8'));
const publicTasks = trainingSet.tasks.map(({ id, kind, topic, prompt, code, options }) => ({
  id, kind, topic, prompt,
  ...(code === undefined ? {} : { code }),
  ...(options === undefined ? {} : { options: options.map(({ id: optionId, label }) => ({ id: optionId, label })) })
}));

const json = (res, status, value, origin) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' });
  res.end(JSON.stringify(value));
};
const error = (res, status, code, message, origin) => json(res, status, { error: { code, message } }, origin);
const attemptView = ({ id, setId, status, answers }) => ({ id, setId, status, answers: answers.map((answer) => ({ ...answer })) });

function parseUrl(request) { return new URL(request.url, 'http://localhost').pathname.split('/').filter(Boolean); }

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > BODY_LIMIT) { const e = new Error('body too large'); e.code = 'TOO_LARGE'; throw e; }
    chunks.push(chunk);
  }
  if (!size) throw Object.assign(new Error('request body is required'), { code: 'INVALID_BODY' });
  let value;
  try { value = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw Object.assign(new Error('body must be valid JSON'), { code: 'INVALID_BODY' }); }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw Object.assign(new Error('body must be a JSON object'), { code: 'INVALID_BODY' });
  return value;
}

function validId(value) { return typeof value === 'string' && /^[A-Za-z0-9_-]+$/.test(value); }
function findTask(id) { return trainingSet.tasks.find((task) => task.id === id); }
function resultFor(attempt) {
  const items = trainingSet.tasks.map((task) => {
    const answer = attempt.answers.find((item) => item.taskId === task.id);
    if (!answer) return { taskId: task.id, status: 'unanswered', score: 0, maxScore: 1, feedback: 'Ответ не задан.' };
    if (task.kind === 'short-text' && answer.text.trim()) return { taskId: task.id, status: 'pending-review', score: null, maxScore: 1, feedback: 'Ответ ожидает ручной проверки.' };
    if (task.kind === 'short-text') return { taskId: task.id, status: 'unanswered', score: 0, maxScore: 1, feedback: 'Ответ не задан.' };
    const correct = (task.id === 'ts-1' && answer.optionId === 'b') || (task.id === 'ts-2' && answer.optionId === 'a');
    return { taskId: task.id, status: correct ? 'correct' : 'incorrect', score: correct ? 1 : 0, maxScore: 1, feedback: correct ? 'Верно.' : 'Ответ требует проверки.' };
  });
  const pending = items.some((item) => item.status === 'pending-review');
  return { attemptId: attempt.id, status: pending ? 'pending-review' : 'graded', score: pending ? null : items.reduce((sum, item) => sum + item.score, 0), maxScore: trainingSet.tasks.length, items };
}

export function createServer() {
  const attempts = new Map();
  return createHttpServer(async (req, res) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Demo-Fail');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.writeHead(204, { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'Content-Type, X-Demo-Fail', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' }).end();
    if (req.headers['x-demo-fail'] === '1') return error(res, 500, 'DEMO_FAILURE', 'Искусственная учебная ошибка.', origin);
    const parts = parseUrl(req);
    try {
      if (req.method === 'GET' && parts.join('/') === 'api/sets') return json(res, 200, [{ id: trainingSet.id, title: trainingSet.title, taskCount: publicTasks.length }], origin);
      if (req.method === 'GET' && parts.length === 3 && parts[0] === 'api' && parts[1] === 'sets') {
        if (parts[2] !== trainingSet.id) return error(res, 404, 'NOT_FOUND', 'Набор не найден.', origin);
        return json(res, 200, { id: trainingSet.id, title: trainingSet.title, tasks: publicTasks }, origin);
      }
      if (req.method === 'POST' && parts.join('/') === 'api/attempts') {
        const body = await readJson(req);
        if (Object.keys(body).length !== 1 || body.setId !== trainingSet.id) return error(res, 400, 'INVALID_BODY', 'setId должен ссылаться на существующий набор.', origin);
        const attempt = { id: crypto.randomUUID(), setId: trainingSet.id, status: 'in-progress', answers: [] };
        attempts.set(attempt.id, attempt); return json(res, 201, attemptView(attempt), origin);
      }
      if (parts.length >= 3 && parts[0] === 'api' && parts[1] === 'attempts') {
        const attempt = attempts.get(parts[2]);
        if (!attempt) return error(res, 404, 'NOT_FOUND', 'Попытка не найдена.', origin);
        if (req.method === 'GET' && parts.length === 3) return json(res, 200, attemptView(attempt), origin);
        if (parts.length === 4 && parts[3] === 'result' && req.method === 'GET') {
          if (!attempt.result) return error(res, 409, 'NOT_SUBMITTED', 'Попытка ещё не отправлена.', origin);
          return json(res, 200, attempt.result, origin);
        }
        if (parts.length === 4 && parts[3] === 'submit' && req.method === 'POST') {
          const body = await readJson(req);
          if (Object.keys(body).length) return error(res, 400, 'INVALID_BODY', 'Для submit нужен пустой объект.', origin);
          if (attempt.result) return json(res, 200, attempt.result, origin);
          attempt.status = 'submitted'; attempt.result = resultFor(attempt);
          return json(res, 200, attempt.result, origin);
        }
        if (parts.length === 5 && parts[3] === 'answers' && (req.method === 'PUT' || req.method === 'DELETE')) {
          const taskId = parts[4];
          if (!validId(taskId) || !findTask(taskId)) return error(res, 404, 'NOT_FOUND', 'Задание не найдено.', origin);
          if (attempt.status === 'submitted') return error(res, 409, 'ALREADY_SUBMITTED', 'Отправленная попытка не изменяется.', origin);
          if (req.method === 'DELETE') { attempt.answers = attempt.answers.filter((answer) => answer.taskId !== taskId); return json(res, 200, attemptView(attempt), origin); }
          const body = await readJson(req);
          if (body.taskId !== taskId || !validId(body.taskId) || (body.kind !== 'single-choice' && body.kind !== 'short-text')) return error(res, 400, 'INVALID_ANSWER', 'Ответ имеет неверные id или kind.', origin);
          const task = findTask(taskId);
          if (body.kind !== task.kind) return error(res, 400, 'INVALID_ANSWER', 'kind не совпадает с заданием.', origin);
          const answer = body.kind === 'single-choice' ? { taskId, kind: body.kind, optionId: body.optionId } : { taskId, kind: body.kind, text: body.text };
          if (body.kind === 'single-choice' && (!validId(body.optionId) || !task.options?.some((option) => option.id === body.optionId))) return error(res, 400, 'INVALID_ANSWER', 'optionId не принадлежит заданию.', origin);
          if (body.kind === 'short-text' && typeof body.text !== 'string') return error(res, 400, 'INVALID_ANSWER', 'text должен быть строкой.', origin);
          attempt.answers = [...attempt.answers.filter((item) => item.taskId !== taskId), answer];
          return json(res, 200, attemptView(attempt), origin);
        }
      }
      return error(res, 404, 'NOT_FOUND', 'Маршрут не найден.', origin);
    } catch (e) {
      if (e.code === 'TOO_LARGE') return error(res, 413, 'BODY_TOO_LARGE', 'Тело запроса слишком большое.', origin);
      if (e.code === 'INVALID_BODY') return error(res, 400, 'INVALID_BODY', e.message, origin);
      return error(res, 500, 'INTERNAL_ERROR', 'Внутренняя учебная ошибка.', origin);
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) createServer().listen(PORT, 'localhost', () => console.log(`Учебный API: http://localhost:${PORT}`));
