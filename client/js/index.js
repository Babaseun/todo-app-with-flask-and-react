const container = document.querySelector('.todos-container');
let text = `<div class="input-box"><input type="text" class="form-control input-area" />
<button class="btn btn-secondary" onclick=getInputField()>+</button></div>
           `;
let task = '';
let input = '';
let length = 1;
fetch('http://127.0.0.1:5000/')
 .then((res) => res.json())
 .then((data) => {
  length += data.todos.length;
  data.todos.map((todo) => {
   if (todo.completed) {
    task = `<p class="task-completed">${todo.task}</p>`;
    input = `<input id="input-${todo.id}" type="checkbox" checked onChange=taskCompleted(${todo.completed}) class=""/>`;
   } else {
    task = `<p class="task">${todo.task}</p>`;
    input = `<input id="input-${todo.id}" type="checkbox" onChange=taskCompleted(${todo.completed}) class=""/>`;
   }
   text += `<div class="todos">
              <div class="todo-input">
               ${input}
              </div>
              <div class="todo">
              ${task}
              </div>
              <div class="delete-todo">
              <button onClick=deleteTodo(${todo.id}) class="btn btn-danger">Delete</button>
              </div>
            </div>`;
  });
  container.innerHTML = text;
 });

const deleteTodo = (id) => {
 console.log(id);
};
const taskCompleted = (completed) => {
 fetch(`http://127.0.0.1:5000/update-todo/${completed}`, {
  method: 'PUT',
  data: 1
 })
  .then((res) => res.json())
  .then((data) => {
   console.log(data);
  });
};

const getInputField = () => {
 const input = document.querySelector('.input-area');
 fetch(`http://127.0.0.1:5000/add-todo`, {
  method: 'POST',
  data: { id: length++, task: input.value, completed: 0 }
 })
  .then((res) => res.json())
  .then((data) => {
   console.log(data);
  });
};
