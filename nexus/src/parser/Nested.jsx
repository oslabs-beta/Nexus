import React from 'react';
import Milk from './grandChildren.jsx';
const Nested = props => {
  return (
    <div>
      <Milk />
    </div>
  );
};

export default Nested;
