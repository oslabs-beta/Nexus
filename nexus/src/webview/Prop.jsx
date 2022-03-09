import React, {Component } from "react";

export default function Prop (props) {

    console.log(props);

    // console.log('propArr',propArray);
    return (
        <>
           <p>{props.propKey} : {props.value}</p>
        </>
    );
};