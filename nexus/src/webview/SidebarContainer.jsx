import React, { Component } from 'react';
import NodeWithChildren from './NodeWithChildren.jsx';
import Leaf from './Leaf.jsx';
import AddFile from './AddFile.jsx';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

/*

{ name: 'name',
   props: { prop1: num,
             prop2: string,
              etc.       },
   children: [node1, node2, etc],
   dataFetching: 'ssg' or 'ssr',
   gsPaths: true/false,
   
   fetchDependency: 'apiurl'
 
}

node1 = {
   name: 'name',
   props: { prop1: num,
             prop2: string,
              etc.       },
   children: [node1, node2, etc],
   dataFetching: 'ssg' or 'ssr',
   gsPaths: true/false,
   fetchDependency: 'apiurl'
}

*/

class SidebarContainer extends Component {
  // pass array down as props to all children
  constructor() {
    super();
    this.childrenStore = [];
    this.state = {
      node: {
        name: null,
        props: null,
        children: [],
        dataFetching: null,
        gsPaths: null,
        fetchDependecy: null,
      },
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log('in component did mount');
    // add event listner listening for message
    window.addEventListener('message', event => {
      this.childrenStore = event.data.children;
      console.log('Event from message listener', event);
      this.setState(prevState => ({
        ...prevState,
        node: {
          name: event.data.name
          // props,
          // dataFetching,
          // gsPaths,
          // fetchDependecy
        }
      }));

    });
  }

  handleClick(){
    this.setState(prevState => ({
      ...prevState,
      node : {
        children: this.childrenStore,
      }
    }));
  };

  render() {

    console.log(this.state);

    // initialize an empty array 
    let childrenComp = [];

    if (this.state.node.children) {
      console.log('state.data.children', this.state.node.children);

      childrenComp = this.state.node.children.map(child => {
        if (child.children.length) {   
          console.log('making a nodewithchildren', child.name);
          return <NodeWithChildren node={child}  />;
        } else {
          console.log('making a leaf', child.name);
          return <Leaf node={child} />;
        }
      });
    }


    console.log('children Comp array', childrenComp);

    return (
      <>
      <div>
      <AddFile />
      </div>
    <div className='containerIntro'>
      <a class='fav_icon' onClick={this.handleClick}><FontAwesomeIcon icon={faCirclePlus} className='fav_icon'/></a>
      {(this.state.node.name) ? <h1 className='component-name' onClick={this.handleClick}>{this.state.node.name}</h1> : <div></div>}
      { childrenComp.length ? childrenComp : <div></div>}
      </div>
      </>
    );
  }
}

export default SidebarContainer;
