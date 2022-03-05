import React, {Component} from 'react';


class Leaf extends Component {
  constructor (props) {
    super (props)
  }


  
  render () {
    console.log('leaf: ', this.props);
    return(
    <div>
      <h3>{this.props.data.name}</h3>
      <p>Data Fetching: {this.props.data.dataFetching}</p>
      {/* <p>{this.props.data.props.price}</p> */}
    </div>
    );
  };


};

export default Leaf;