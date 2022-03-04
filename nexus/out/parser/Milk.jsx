import React from 'react';
import Nested from './Nested.jsx';

class Milk extends React.Component {
  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <Nested test={'yo'}/>
        <div>I am GrandChild</div>
      </div>
    )
  }
}

export default Milk;
