import React, { Component } from 'react';
import { Alert, idx, Card } from 'react-bootstrap';
import Carou from './components/Carou';
import CardList from './components/CardList';
import CardForm from './components/CardForm';
import './components/Carou.css';
import './components/App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import {Menu} from 'components';
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import { Home, About, Study } from 'pages';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <Menu></Menu>
            <Route exact path="/" component={Home} />
            <Switch>
            <Route path="/study/:name" component={Study} />
            <Route path="/study" component={Study} />
            </Switch>
            <Switch>
              <Route path="/about/:name" component={About} />
              <Route path="/about" component={About} />
            </Switch>
            <Route exact path="/switcher" component={ThemeSwitcher} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;