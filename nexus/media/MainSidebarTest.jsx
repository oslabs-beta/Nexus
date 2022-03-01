import React, { Component } from 'react';
import Node from './Node.jsx';
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
      data: {}
    };
    
  }

  componentDidMount() {
    console.log('in component did mount');
    // add event listner listening for message
    window.addEventListener('message', (event) => {
      console.log(event);
      this.setState((prevState) => ({
          ...prevState,
          data: event.data,
          // name: this.state.data.children[0].name;
        }));
      // cb function --=>
        // grab data and update state
    
  });
};

  display(){
    // let children;
    // this.state.data !== {} ? this.children = JSON.stringify(this.state.data.children) : children = 'No data in state';

    // let mapped;
    // if (children !== 'No data in state;') {
    //   mapped = children.map((child, i) => {
    //     return <Node data={child} id={i} />
    //   });
    // }
    // else {return children};
    //  return mapped;
    
    // console.log(this.state);
    // let children = [];

    //   if (this.state.data.data) {children = this.state.data.data.children.map((child, i) => {
    //     return <Node data={child} id={i} />
    //   });
    // }

    // console.log(children);  
    //   return children;
    
  
    
  }


  render() {
    // res.map(// factory make Node components from data)
    // let testStr = 'No data in state';
    // if (this.state.data !== {}) {testStr = JSON.stringify(this.state.data.children)};

    console.log('state.data', this.state.data);

    let children;

    if (this.state.data.name) {
      
    console.log('state.data.children', this.state.data.children);
      children = this.state.data.children.map((child) => {
      return <Node data={child} />;
    });
  }

  console.log('children array', children);  
  

    
    return (
      <div>
        {children || <p>No Data in State</p>}
      </div>
    );
  }
}

export default MainSideBarTest;
