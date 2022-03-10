import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

import Prop from './Prop.jsx';

class NavLeaf extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let propsArray = [];
    for (let prop in this.props.node.props) {
      propsArray.push(<Prop propKey={prop} value={this.props.node.props[prop]} />);
    }

    console.log('navleaf: ', this.props);
    return (
      <>
        <div className="leaf-comp-container">
          <h1 className="leaf-comp-name">{this.props.node.name}</h1>
           {!propsArray.length ? 
          <Tippy placement='bottom'  content={<div id='tips'><div><p className='data-key'>data-fetching:</p> {this.props.node.dataFetching}</div> </div>} class='box'>
          <a class='fav_icon'><FontAwesomeIcon icon={faCircleInfo}/></a>
        </Tippy>
          :
        <Tippy placement='bottom' content={<div id='tips'><div><p className='data-key'>props:</p><p>{propsArray}</p></div> <div><p className='data-key'> data-fetching:</p> {this.props.node.dataFetching}</div> </div>} class='box'>
          <a class='fav_icon'><FontAwesomeIcon icon={faCircleInfo}/></a>
        </Tippy>
        }
        </div>
      </>
    );
  }
}

export default NavLeaf;
