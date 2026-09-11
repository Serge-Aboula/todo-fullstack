const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server/index');

test('GET /api/todos renvoie un tableau avec un code 200', async () => {
  const res = await request(app).get('/api/todos');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
});

test('POST /api/todos sans "text" renvoie une erreur 400', async () => {
  const res = await request(app).post('/api/todos').send({});
  assert.strictEqual(res.status, 400);
});

test('POST /api/todos avec "text" crée une tâche (201)', async () => {
  const res = await request(app).post('/api/todos').send({ text: 'Tâche de test' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.text, 'Tâche de test');
});