const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  renderTodos(todos);
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

async function toggleDone(id, done) {
  await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, {
    method: 'DELETE'
  });
  fetchTodos();
}

fetchTodos(); // appel initial au chargement de la page

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // empêche le rechargement de page par défaut du formulaire

  const text = input.value.trim();
  if (!text) return;

  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (res.ok) {
    input.value = ''; // vide le champ
    fetchTodos(); // recharge la liste depuis le serveur
  } else {
    const error = await res.json();
    alert(error.error);
  }
});