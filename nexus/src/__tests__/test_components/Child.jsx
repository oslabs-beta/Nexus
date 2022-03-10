import React from 'react';

class Child extends React.component {
  constructor() {
    super();
  }

  render() {
    return <div>I am GrandChild</div>;
  }
}

export default Child;
