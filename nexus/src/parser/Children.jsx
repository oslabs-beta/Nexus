import React from 'react';
import Nested from './Nested.jsx';

const Children = (props) => {
  return (
      <div>
        <Nested propName='testing'/>
      </div>
  )
};

export default Children;