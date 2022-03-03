import React, {Component} from 'react';
import Leaf from './Leaf.jsx';


class NodeWithChildren extends Component {
constructor (props) {
  super (props);
  this.children = [];
}



  // wrap this in function and call recursively when parent node is clicked
  //  handleClick () {

  // }

  render () {

        // let nodeChildren = [];
    
    // this.children = [<Leaf data={{name: 'test Leaf', children: [], props: {price: 'Test Leaf Props'}}} />];


        this.children = this.props.data.children.map(child => {
          if (child.children.length) {
            return <NodeWithChildren data={child}/>;
          } else {
            return <Leaf data={child}/>;
          }
        });

    
    return (

    <div>
   
      <h3>{this.props.data.name}</h3>
      {/* {props.data.children} */}
      {/* <p>{this.props.data.props.price}</p> */}
      <p>{this.props.data.props.name}</p>
      <p>{this.children}</p>
    </div>

);
}


};

export default NodeWithChildren;