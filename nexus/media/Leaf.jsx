import React from 'react';


const Leaf = (props) => {

  return (

    <div>
      <h1>{props.data.name}</h1>
      <p>{props.data.props.price}</p>
    </div>

  );


};

export default Leaf;