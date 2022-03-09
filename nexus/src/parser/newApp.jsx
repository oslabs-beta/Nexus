import React from 'react';
import Silk from './Milk.jsx';

const URL = 'http://google.com';


class App extends React.Component {
    constructor (){
        // super();
    }

    render(){
        return(   
        <div> 
            <Silk number={2}/>
        </div>
        );
    }
}
