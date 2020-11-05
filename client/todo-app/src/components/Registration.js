import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Image from './Spinner-1s-200px.gif';

function Registration() {
  const [error, setError] = useState('');
  const [errorStyle, setErrorStyle] = useState('');
  const [spinnerStyle, setSpinnerStyle] = useState('display-spinner');
  const [formStyle, setFormStyle] = useState('');
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    setFormStyle('display-spinner');
    setSpinnerStyle('');
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    fetch('http://localhost:5000/api/v1/register', config)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
          setErrorStyle('bg-danger text-white p-2');
          setFormStyle('');
          setSpinnerStyle('display-spinner');
        } else {
          localStorage.setItem('token', data.token);
          window.location = '/todos';
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="form">
      <div className={`spinner-container ${spinnerStyle}`}>
        <img className="spinner" src={Image} alt="spinner" />
      </div>
      <div className={`form ${formStyle}`}>
        <h3>Register Here</h3>
        <p className={errorStyle}>{error}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              ref={register({ required: true })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              ref={register({ required: true })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              ref={register({ required: true })}
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
    </div>
  );
}
export default Registration;
