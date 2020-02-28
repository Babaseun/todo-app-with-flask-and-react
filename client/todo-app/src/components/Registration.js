import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function Registration() {
 const [error, setError] = useState('');
 const [errorStyle, setErrorStyle] = useState('');

 const { register, handleSubmit } = useForm();
 const onSubmit = (data) => {
  const config = {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify(data)
  };
  fetch('http://localhost:5000/api/v1/register', config)
   .then((res) => res.json())
   .then((data) => {
    if (data.message) {
     setError(data.message);
     setErrorStyle('bg-danger text-white p-2');
    }
   });
 };

 return (
  <div className="form">
   <h3>Register Here</h3>
   <p className={errorStyle}>{error}</p>
   <form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-group">
     <label>Name</label>
     <input
      name="name"
      type="text"
      className="form-control"
      ref={register({})}
     />
    </div>
    <div className="form-group">
     <label>Email</label>
     <input
      name="email"
      type="email"
      className="form-control"
      ref={register({})}
     />
    </div>
    <div className="form-group">
     <label>Password</label>
     <input
      name="password"
      type="password"
      className="form-control"
      ref={register({})}
     />
    </div>
    <div className="form-group">
     <button className="btn btn-primary btn-block">Sign up</button>
    </div>
   </form>
   <small className="text-mute">
    Already registered ? <Link to="/login">Login Here</Link>
   </small>
  </div>
 );
}
export default Registration;
