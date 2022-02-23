import React, { Component, render } from 'react';
import main from '../src/parser/parser.js';
import test from './test.js';
// import Node from 'Nodes.jsx'

// interface ComponentNode {
//   name: string,
//   children: Array<any>,
//   props: Object
// }

class MainSideBarTest extends Component {
  // pass array down as props to all children
  constructor() {
    super();
    this.dummyParserData = {
      name: 'App',
      children: [{ name: 'Child', children: [], props: { price: '5000' } }],
      props: { example: 'test' },
    };
  }

  componentDidMount() {
    // const res = parser('../src/parser/App.jsx');
    // console.log(res);
    // console.log(main);
    // console.log(test);
    console.log(main);
    console.log('test string');
    const testStr = 'I am a string initialized in componentDidMount';
  }

  render() {
    // res.map(// factory make Node components from data)

    const testStr = 'I am a string initialized in the render method';
    console.log('hello');
    return (
      <div>
        <h1>I'm the main sidebar parent HELLO</h1>
        <div>{testStr}</div>
      </div>
    );
  }
}

export default MainSideBarTest;
