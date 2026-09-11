const express = require("express");
const path = require("path");
const todosStore= require("./todos");

const app = express();
const PORT = 3000;

// middleware : parse le JSON envoyé dans req.body
app.use(express.json());
// Middleware : sert les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, "..", "/public")));

// GET /api/todos -> liste toutes les tâches
app.get('/api/todos', (_req, res) => {
  res.json(todosStore.getAll());
});

// POST /api/todos -> crée une tâche
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Le champ "text" est requis' });
  }
  const todo = todosStore.create(text);
  res.status(201).json(todo);
});

// PUT /api/todos/:id -> met à jour une tâche (ex: cocher comme faite)
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const updated = todosStore.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Tâche introuvable' });
  }
  res.json(updated);
});

// DELETE /api/todos/:id -> supprime une tâche
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  todosStore.remove(id);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;