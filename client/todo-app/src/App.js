import React from 'react';
import Header from './components/Header';
import Registration from './components/Registration';
import Login from './components/Login';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Todos from './components/Todos';

function App() {
 return (
  <div>
   <Header />
   <Router>
    <Route exact path="/" component={Registration} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/todos" component={Todos} />
   </Router>
  </div>
 );
}

export default App;
