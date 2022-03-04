import React from 'react';
import Milk from './Milk.jsx';

const URL = 'http://google.com';


class App extends React.Component {
    constructor (){
        // super();
    }

    render(){
        return(    
        <Milk number={2}/>
        );
    }
}