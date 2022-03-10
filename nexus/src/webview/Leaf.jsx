import React, { Component } from 'react';
import Prop from './Prop.jsx';

// imports for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

class Leaf extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let propsArray = [];
    // iterate through the node's props property, generating Prop components
    for (let prop in this.props.node.props) {
      propsArray.push(<Prop propKey={prop} value={this.props.node.props[prop]} />);
    }
    return (
      <>
        <div className="leaf-comp-container">
          <h1 className="leaf-comp-name">{this.props.node.name}</h1>
          <Tippy
            placement="right"
            id="Tips"
            flip="true"
            content={
              <>
                <div>props = {propsArray}</div>{' '}
                <div>data-fetching = {this.props.node.dataFetching}</div>{' '}
              </>
            }
            class="box"
          >
            <a class="info_icon">
              <FontAwesomeIcon icon={faCircleInfo} />
            </a>
          </Tippy>
        </div>
      </>
    );
  }
}

export default Leaf;
