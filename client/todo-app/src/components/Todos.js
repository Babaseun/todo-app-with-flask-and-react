import React, { useEffect, useState } from 'react';
import Input from './InputBox';
import Image from './Spinner-1s-200px.gif';

function Todos() {
 const [todos, setTodos] = useState([]);
 const [user, setUser] = useState('');
 const [spinnerStyle, setSpinnerStyle] = useState('');
 const [deleteMessage, setDeleteMessage] = useState('');
 const [message, setMessage] = useState('');
 const [noData, setNoDataStyle] = useState('display');

 useEffect(() => {
  const config = {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
    'X-Access-Token': localStorage.getItem('token')
   }
  };
  fetch('http://localhost:5000/api/v1/todos', config)
   .then((res) => res.json())
   .then((data) => {
    if (data) {
     const [user, { todos }] = data;
     setUser(user.username);
     setSpinnerStyle('display-spinner');
     if (data.message) {
      setMessage(data.message);
      setNoDataStyle('');
     } else {
      setNoDataStyle('display');
      setTodos([todos]);
     }
    } else {
     setSpinnerStyle('');
    }
   });
 }, []);

 const deleteTodo = (id) => {
  const config = {
   method: 'DELETE',
   headers: {
    'Content-Type': 'application/json',
    'X-Access-Token': localStorage.getItem('token')
   }
  };
  fetch(`http://localhost:5000/api/v1/todos/${id}`, config)
   .then((res) => res.json())
   .then((data) => {});
 };

 return (
  <div className="todo-section">
   <div className={`spinner-container ${spinnerStyle}`}>
    <img className="spinner" src={Image} alt="spinner" />
   </div>
   <div className="main-todo-section">
    <h3 className="text-center">Welcome {user}</h3>
    <Input />

    <div className="todo-container">
     <div className={`bg-success text-white ${noData}`}>{message}</div>

     {todos.map((todo) => (
      <div key={todo.id} className="todo">
       <input type="checkbox" />
       <p>{todo.todo}</p>
       <button onClick={() => deleteTodo(todo.id)} className="btn btn-danger">
        Delete
       </button>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}

export default Todos;
