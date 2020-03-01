import React, { useEffect, useState } from "react";
import Input from "./InputBox";
import Image from "./Spinner-1s-200px.gif";
import axios from "axios";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState("");
  const [spinnerStyle, setSpinnerStyle] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSpinnerStyle("display-spinner");
    setSection("");

    const url = "http://localhost:5000/api/v1/todos";
    const config = {
      headers: {
        "content-type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    };
    axios
      .get(url, config)
      .then(res => {
        console.log(res.data);

        setUser(res.data[0].username);
        if (res.data[1].todos) {
          setTodos(res.data[1].todos);
        } else {
          setMessage(res.data[1].message);
        }
      })
      .catch(err => console.log(err));
  }, []);
  const deleteTodo = id => {
    setSpinnerStyle("");
    setSection("display");

    const url = `http://localhost:5000/api/v1/todos/${id}`;
    const config = {
      headers: { "X-Access-Token": localStorage.getItem("token") }
    };
    axios.delete(url, config).then(res => {
      console.log(res);
      window.location.href = "/todos";
    });
  };
  const completedTodo = (id, completed) => {
    setSpinnerStyle("");
    setSection("display");
    var data = completed;
    if (completed) {
      data = 0;
    } else {
      data = 1;
    }
    const url = `http://localhost:5000/api/v1/todos/${id}`;
    const config = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ completed: data })
    };
    fetch(url, config)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        window.location.href = "/todos";
      });
  };
  const logOutUser = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="todo-section">
      <div className={`spinner-container ${spinnerStyle}`}>
        <img className="spinner" src={Image} alt="spinner" />
      </div>
      <div className={section}>
        <div className="center-name">
          <h3 className="user">Welcome {user}</h3>
          <button
            className="btn btn-outline-success"
            onClick={() => logOutUser()}
          >
            Logout
          </button>
        </div>

        <Input />
        <div className="todo-container">
          <div>{message}</div>
          {todos.map(({ id, completed, todo }) => (
            <div key={id} className="todo">
              <input
                checked={completed}
                type="checkbox"
                onChange={() => completedTodo(id, completed)}
              />
              <p className={`todo-style-${completed}`}>{todo}</p>
              <button
                onClick={() => deleteTodo(id)}
                className="mr-2 btn btn-danger"
              >
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
