import React, {Component} from 'react';


class Leaf extends Component {
  constructor (props) {
    super (props)
  }


  
  render () {

    return(
    <div>
      <h3>{this.props.data.name}</h3>
      <p>{this.props.data.props.price}</p>
    </div>
    );
  };


};

export default Leaf;