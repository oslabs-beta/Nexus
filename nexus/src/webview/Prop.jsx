import React from 'react';

export default function Prop(props) {
  return (
    <>
      <p>
        {props.propKey} : {props.value}
      </p>
    </>
  );
}
