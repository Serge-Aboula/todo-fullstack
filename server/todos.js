let todos= [
    { id: 1, text: "Apprendre Express", done: false }
];
let nextId = 2;

function getAll () {
    return todos;
}

function create (text) {
    const todo = { id: nextId++, text, done: false };
    todos.push(todo);
    return todo;
}

function remove (id) {
    todos = todos.filter(todo => todo.id !== id);
}

function update (id, changes) {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
        return null;
    }
    Object.assign(todo, changes);
    return todo;
}

module.exports = { getAll, create, remove, update };