import React, {Component} from 'react';


class Leaf extends Component {
  constructor (props) {
    super (props);
  }


  
  render () {
    console.log('leaf: ', this.props);
    return(
    <div class="children">
      <h3>{this.props.node.name}</h3>
      <p>Data Fetching: {this.props.node.dataFetching}</p>
      {/* <p>{this.props.data.props.price}</p> */}
    </div>
    );
  };


};

export default Leaf;