import React, { Component } from 'react';
import Leaf from './Leaf.jsx';
import Prop from './Prop.jsx';

// imports for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleInfo, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

class NodeWithChildren extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
      expanded: false,
    };
    // bind the function to this context so it can be invoked from any instantiation of the Component
    this.handleClick = this.handleClick.bind(this);
  }

  // handle click function that renders the children data (aka child components, data fetching methods, props) passed down as props
  handleClick() {
    // if the component is not expanded (children are not rendered), updated state with children stored in props.node.children
    if (!this.state.expanded) {
      this.setState(prevState => {
        // checking special case in which the children nodes are nested in a subarray within the children array. also short circuiting this conditional if array is empty.
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
      // if the children are rendered, update children property in state to be an empty array, effectvely furling the parent back up
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

  render() {
    let propsArray = [];
    // iterate through the node's props property, generating Prop components
    for (const prop in this.props.node.props) {
      propsArray.push(<Prop propKey={prop} value={this.props.node.props[prop]} />);
    }

    // initialize array into which we push children components when there are children nodes in state
    let childrenComp = [];
    // if there are children nodes in state
    if (this.state.children.length) {
      // generate components and map them to childrenComp
      childrenComp = this.state.children.map(child => {
        // if the child node itself has children, recursively render a NodeWithChildren component
        if (child.children.length) {
          return <NodeWithChildren node={child} />;
          // if the child node itself has no children, render a Leaf component
        } else {
          return <Leaf node={child} />;
        }
      });
    }

    return (
      // inside the NodeWithChildren Components, render the Child Component, data fetching method, props...

      <div className="comp-with-children-container">
        {this.state.expanded ? (
          <a className="node_icon" onClick={this.handleClick}>
            <FontAwesomeIcon className="fav_icon" icon={faCircleMinus} />
          </a>
        ) : (
          <a className="node_icon" onClick={this.handleClick}>
            <FontAwesomeIcon className="fav_icon" icon={faCirclePlus} />
          </a>
        )}
        <h1 class="comp-with-children-name" onClick={this.handleClick}>
          {this.props.node.name}
        </h1>
        {!propsArray.length ? (
          <Tippy
            placement="bottom"
            content={
              <div id="tips">
                {' '}
                <div>
                  <p className="data-key">data-fetching: </p>
                  {this.props.node.dataFetching}
                </div>{' '}
              </div>
            }
            class="box"
          >
            <a class="fav_icon info_icon">
              <FontAwesomeIcon className="info_icon-inner" icon={faCircleInfo} />
            </a>
          </Tippy>
        ) : (
          <Tippy
            placement="bottom"
            content={
              <div id="tips">
                <div>
                  <p className="data-key">props:</p>
                  {propsArray}
                </div>{' '}
                <div>
                  <p className="data-key">data-fetching:</p> {this.props.node.dataFetching}
                </div>{' '}
              </div>
            }
            class="box"
          >
            <a class="fav_icon info_icon">
              <FontAwesomeIcon className="info_icon-inner" icon={faCircleInfo} />
            </a>
          </Tippy>
        )}

        {childrenComp}
      </div>
    );
  }
}

export default NodeWithChildren;
