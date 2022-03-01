import React from 'react';


export default Node = (props) => {

  return (

    <div>
      <h1>{props.data.name}</h1>
      <p>{props.data.children}</p>
      <p>{props.data.props.price}</p>
    </div>

  )


}