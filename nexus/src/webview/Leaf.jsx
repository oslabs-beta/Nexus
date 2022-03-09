import React, {Component} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";

import Prop from "./Prop.jsx";

class Leaf extends Component {
  constructor (props) {
    super (props);
  }



  
  render () {
    let propsArray = [];
    for(let prop in this.props.node.props){
      propsArray.push(<Prop propKey={prop} propValue={this.props.node.props[prop]}/>)
    }
    console.log('leaf: ', this.props);
    return(
    <div class="children">
      <h3>{this.props.node.name}</h3>
      <Tippy content={<><div>props:{propsArray}</div> <div>data-fetching: {this.props.node.dataFetching}</div> </>} class='box'>
        {/* <p>{this.props.node.dataFetching}</p>
        {propsArray} */}
        <a class='fav_icon'><FontAwesomeIcon icon={faCircleInfo}/></a>
      </Tippy>
    </div>
    );
  };


};

export default Leaf;