import React, { Component } from 'react';
import Leaf from './Leaf.jsx';
import Prop from './Prop.jsx';

// import for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleInfo, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

class NodeWithChildren extends Component {
  // example of prop being passed down to this component
  // {
  //   name : 'Children',
  //   children : Array[],
  //   props : {},
  //   data fetching : String,
  // }

  constructor(props) {
    super(props);
    this.state = {
      children: [],
      expanded: false,
    };
    // bind the function so it can be passed down to children components as props
    this.handleClick = this.handleClick.bind(this);
  }

  // handle click functionality that renders the children data (aka child components, data fetching methods, props) passed down as props
  // when the handle click function is invoked, update the state to render the children data

  handleClick() {
    if (!this.state.expanded) {
      this.setState(prevState => {
        if (this.props.node.children.length === 0 || !Array.isArray(this.props.node.children[0])) {
          return {
            ...prevState,
            children: this.props.node.children,
            expanded: true,
          };
        } else {
          return {
            ...prevState,
            children: this.props.node.children[0],
            expanded: true,
          };
        }
      });
    } else {
      this.setState(prevState => {
        return {
          ...prevState,
          children: [],
          expanded: false,
        };
      });
    }
  }

  // recursively rendering the data to each component (children components, props, data fetching method used by the component)
  // use componentDidMount to render the top level component of the tree
  // when a component at the top level is clicked, recursively render the data etc for

  render() {
    console.log('state', this.state);
    console.log('props', this.props);
    // console.log('in node with children');

    // const propKeys = Object.keys(this.props.node.props);
    // const propArray = propKeys.map(prop=>{
    //   return <p>{prop}:{this.props.node.props[prop]}</p>;
    // })

    // console.log('propArr',propArray);
    let propsArray = [];

    for (const prop in this.props.node.props) {
      propsArray.push(<Prop propKey={prop} value={this.props.node.props[prop]} />);
    }

    // console.log('this.props.data: ', this.props.data);
    // console.log('this.props.data.children: ', this.props.data.children);
    let childrenComp = [];
    if (this.state.children.length) {
      console.log('in this.state.children exists logic');
      childrenComp = this.state.children.map(child => {
        if (child.children.length) {
          console.log('making a node with children', child);
          return <NodeWithChildren node={child} />;
        } else {
          console.log('making a leaf', child);
          return <Leaf node={child} />;
        }
      });
    }

    console.log(childrenComp);

    // initialize an array that will hold all the child components to be able to click inside them and render the respective data for each child components

    // <Tippy content={<div>props:{propsArray}</div>}>
    //     {/* <p>{this.props.node.dataFetching}</p>
    //     {propsArray} */}
    //     <a><FontAwesomeIcon icon={faCircleInfo}/></a>
    //   </Tippy>

    // <><div>props:{propsArray}</div> <div>data-fetching: {this.props.node.dataFetching}</div> </>
    return (
      // inside the NodeWithChildren Components, render the Child Component, data fetching method, props...
      <div className="comp-with-children-container">
        {this.state.expanded ? (
          <a className="node_icon" onClick={this.handleClick}>
            <FontAwesomeIcon icon={faCircleMinus} className="fav_icon" />
          </a>
        ) : (
          <a className="node_icon" onClick={this.handleClick}>
            <FontAwesomeIcon icon={faCirclePlus} className="fav_icon" />
          </a>
        )}
        <h1 class="comp-with-children-name" onClick={this.handleClick}>
          {this.props.node.name}
        </h1>
        <Tippy
          placement="right"
          flip="true"
          content={
            <>
              <div>props:{propsArray}</div> <div>data-fetching: {this.props.node.dataFetching}</div>{' '}
            </>
          }
          class="box"
        >
          <a className="info_icon">
            <FontAwesomeIcon icon={faCircleInfo} />
          </a>
        </Tippy>

        {childrenComp}
      </div>
    );
  }
}

export default NodeWithChildren;
