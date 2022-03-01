import React from 'react';
import Leaf from './Leaf.jsx';


export default NodeWithChildren = (props) => {

  let children = [];

  
    children = props.data.children.map(child => {
      if (child.children.length) {
        return <NodeWithChildren data={child}/>;
      } else {
        return <Leaf data={child}/>;
      }
    });
  

  return (

    <div>
      <h1>{props.data.name}</h1>
      <p>{children}</p>
      <p>{props.data.props.price}</p>
    </div>

  )


}