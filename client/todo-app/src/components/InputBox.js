import React from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';
function InputBox() {
 const { handleSubmit, register } = useForm();
 const addTodo = ({ input }) => {
  const data = {
   todo: input,
   created_at: moment().format('lll'),
   completed: 0
  };
  const config = {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
    'X-Access-Token': localStorage.getItem('token')
   },
   body: JSON.stringify(data)
  };
  fetch('http://localhost:5000/api/v1/todos', config)
   .then((res) => res.json())
   .then((data) => {
    console.log(data);
   });
 };
 return (
  <form onSubmit={handleSubmit(addTodo)}>
   <div className="form-group search-box">
    <input
     name="input"
     type="text"
     className="form-control"
     ref={register()}
     placeholder="Add Todo....."
    />
    <button className="btn btn-secondary">+</button>
   </div>
  </form>
 );
}

export default InputBox;
