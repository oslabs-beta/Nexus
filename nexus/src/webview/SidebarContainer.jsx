import React, { Component } from 'react';
import NodeWithChildren from './NodeWithChildren.jsx';
import Leaf from './Leaf.jsx';
import AddFile from './AddFile.jsx';

class SidebarContainer extends Component {
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
      console.log('Event from message listener', event);
      this.setState(prevState => ({
        ...prevState,
        data: event.data,
      }));

    });
  }

  render() {

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

    return <div>{children || <AddFile />}</div>;
  }
}

export default SidebarContainer;
