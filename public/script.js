const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const errorBox = document.getElementById('error-message');

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = 'block';
}

function clearError() {
  errorBox.style.display = 'none';
}

async function fetchTodos() {
  try {
    clearError();
    const res = await fetch('/api/todos');
    if (!res.ok) {
      throw new Error('Impossible de récupérer les tâches');
    }
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    showError('Erreur de connexion au serveur. Réessaie dans quelques instants.');
  }
}

function renderTodos(todos) {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleDone(todo.id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.done) {
      span.style.textDecoration = 'line-through';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  const text = input.value.trim();
  if (!text) return;

  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (res.ok) {
      input.value = '';
      fetchTodos();
    } else {
      const error = await res.json();
      showError(error.error);
    }
  } catch (err) {
    showError('Erreur de connexion au serveur. Ta tâche n\'a pas été ajoutée.');
  }
});

async function toggleDone(id, done) {
  try {
    clearError();
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
    if (!res.ok) throw new Error();
    fetchTodos();
  } catch (err) {
    showError('Impossible de mettre à jour cette tâche.');
    fetchTodos(); // resynchronise l'affichage avec le serveur en cas d'échec
  }
}

async function deleteTodo(id) {
  try {
    clearError();
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    fetchTodos();
  } catch (err) {
    showError('Impossible de supprimer cette tâche.');
  }
}

fetchTodos();