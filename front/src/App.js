import React, { Component } from 'react';
import  {  Route, Switch, Link } from 'react-router-dom';

import './App.css';

import  { Home } from './Home';
import {About} from './About';
import Contact from './Contact';
import Error from './Error';

import {ProtectedRoute} from './protected.route'
class App extends Component {
  render () {
    return (
      <div>
               <ul>
          <li>
            <Link to = {'/'}>home</Link>
          </li>
          <li>
            <Link to = {'/contact'}>contact</Link>
          </li>
          <li>
            <Link to = {'/about'}>about</Link>
          </li>
        </ul>

        <Switch>
          <Route exact path = '/' component = {Home} />
          <Route  path = '/contact' component = {Contact} />
          <ProtectedRoute exact path = '/about' component = {About} />
          <Route  component = {Error} />
          
        </Switch>
      </div>


    );
  }
}

export default App;
