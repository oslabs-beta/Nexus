import React, {Component } from "react";

export default function Prop (props) {
    // const {property} = props;
    // const propKeys = Object.keys(property);
    // const propArray = propKeys.map(prop=>{
    //   return `${prop}:${property.node.props[prop]}`;
    // });

    console.log(props);

    // console.log('propArr',propArray);
    return (
        <>
           <p>{props.propKey} : {props.value}</p>
        </>
    );
};