import React, { Component } from 'react';
import NodeWithChildren from './NodeWithChildren.jsx';
import Leaf from './Leaf.jsx';
import AddFile from './AddFile.jsx';
import NavLeaf from './NavLeaf.jsx';

// imports for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

class SidebarContainer extends Component {
  constructor() {
    super();
    this.childrenStore = [];
    this.state = {
      node: {
        name: null,
        props: null,
        children: [],
        dataFetching: null,
        gsPaths: null,
        fetchDependecy: null,
      },
      expanded: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // add event listner listening for message from NexusProvider, passing the data returned from the parser to the front end
    window.addEventListener('message', event => {
      // store the children array as a property in order to update children property in state in handleClick
      this.childrenStore = event.data.children;
      // update state with data from the parser
      this.setState(prevState => ({
        ...prevState,
        node: {
          name: event.data.name,
        },
      }));
    });
  }

  // onclick on the icon or the component name, update children property in state
  handleClick() {
    // if the children are not unfurled, update children property in state with childrenStore property
    if (!this.state.expanded) {
      this.setState(prevState => {
        let newNode = { ...prevState.node };
        return {
          node: {
            ...newNode,
            children: this.childrenStore,
          },
          expanded: true,
        };
      });
      // if the children are unfurled, updated children property in state with an empty array, effectively furling the children back into the parent
    } else {
      this.setState(prevState => {
        let newNode = { ...prevState.node };
        return {
          node: {
            ...newNode,
            children: [],
          },
          expanded: false,
        };
      });
    }
  }

  render() {
    // initialize array into which we push children components when there are children nodes in state
    let childrenComp = [];
    // if there are children nodes in state
    if (this.state.node.children) {
      // generate components and map them to childrenComp
      childrenComp = this.state.node.children.map(child => {
        // if the child node itself has children, render a NodeWithChildren component
        if (child.children.length) {
          return <NodeWithChildren node={child} />;
          // if the node to render is a Nav node, this is a special case for styling, so render a special case NavLeaf component
        } else if (child.name === 'Nav') {
          return <NavLeaf node={child} />;
          // if the child node itself has no children, render a Leaf component
        } else {
          return <Leaf node={child} />;
        }
      });
    }

    return (
      <div className="container-intro">
        <AddFile />
        {/* if there is a name property in state, render it, otherwise render the generate tree message */}
        <div className="tree-container">
          {this.state.node.name ? (
            <div>
              {this.state.expanded ? (
                <a className="node_icon" onClick={this.handleClick}>
                  <FontAwesomeIcon icon={faCircleMinus} className="fav_icon" />
                </a>
              ) : (
                <a className="node_icon" onClick={this.handleClick}>
                  <FontAwesomeIcon icon={faCirclePlus} className="fav_icon" />
                </a>
              )}
              <h1 className="comp-with-children-name" onClick={this.handleClick}>
                {this.state.node.name}
              </h1>
            </div>
          ) : (
            <p className="generate-tree-message">Generate tree...</p>
          )}
          {/* if the childrenComp array has any children, render the children, otherwise render an empty div */}
          {childrenComp.length ? childrenComp.reverse() : <></>}
        </div>
      </div>
    );
  }
}

export default SidebarContainer;
