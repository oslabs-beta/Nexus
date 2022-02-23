import React, { Component, render } from 'react';
import parser from '../src/parser/parser.js';

class MainSideBarTest extends Component() {
  // pass array down as props to all children

  componentDidMount() {
    const res = parser('../src/parser/App.jsx');
    console.log(res);
    console.log('test string');
    const testStr = 'I am a string initialized in componentDidMount';
  }

  render() {
    const testStr = 'I am a string initialized in componentDidMount';
    console.log('hello');
    return (
      <div>
        <h1>I'm the main sidebar parent</h1>
        <div>{testStr}</div>
      </div>
    );
  }
}

export default MainSideBarTest;
