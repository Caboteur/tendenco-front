import React, { Component } from 'react';
import './App.css';
import Container from './components/Container.js'
import logo from './logo.svg';

class App extends Component {


  render() {
    return (
      <div className="App">
         <img src={logo} className="App-logo" alt="logo" />
        <h1 className="title">Les actualités recherchées par les internautes sur google en temps réel par pays.</h1>
        <Container />
      </div>
    );
  }
}

export default App;
