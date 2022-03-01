import React, { Component } from 'react';
import NodeWithChildren from './NodeWithChildren.jsx';
import Leaf from './Leaf.jsx';

// import React, { useState, useEffect } from 'react';
// import main from '../src/parser/parser.js';
// import test from './test.js';
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
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    console.log('in component did mount');
    // add event listner listening for message
    window.addEventListener('message', event => {
      console.log(event);
      this.setState(prevState => ({
        ...prevState,
        data: event.data,
        // name: this.state.data.children[0].name;
      }));
      // cb function --=>
      // grab data and update state
    });
  }

  render() {
    // res.map(// factory make Node components from data)

    let children;

    if (this.state.data.name) {
      console.log('state.data.children', this.state.data.children);

      children = this.state.data.children.map(child => {
        if (child.children.length) {
          console.log('making a nodewithchildren', child.name);
          return <NodeWithChildren data={child} />;
        } else {
          console.log('making a leaf', child.name);
          return <Leaf data={child} />;
        }
      });
    }

    console.log('children array', children);

    return <div>{children || <p>No Data in State</p>}</div>;
  }
}

export default MainSideBarTest;
