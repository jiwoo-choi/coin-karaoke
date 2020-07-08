import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Main } from './DisplaySide/Main';
import ControlMain from './ControlSide/ControlMain'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'


function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path="/" exact component={Main}/>
            <Route path="/mobile" exact component={ControlMain}/>
            <Route path="/desktop" exact component={Main}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
