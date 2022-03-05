import React, {Component} from 'react';
import Leaf from './Leaf.jsx';


class NodeWithChildren extends Component {
constructor (props) {
  super (props);
  this.children = [];
}


  render () {
    console.log('in node with children');

    console.log('this.props.data: ', this.props.data);
    console.log('this.props.data.children: ', this.props.data.children);


  
        this.children = this.props.data.children.map(child => {
          if (child.children.length) {
            return <NodeWithChildren data={child}/>;
          } else {
            return <Leaf data={child}/>;
          }
        });

    
    return (
      // TODO: handle props, onhover or onclick
    <div>
   
      <h3>{this.props.data.name}</h3>
      {/* {props.data.children} */}
      {/* <p>{this.props.data.props.price}</p> */}
      <p>{this.props.data.props.name}</p>
      <p>Data Fetching: {this.props.data.dataFetching}</p>
      <p>{this.children}</p>
    </div>

);
}


};

export default NodeWithChildren;