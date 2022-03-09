import React from 'react';
import Silk from './Silk.jsx';

const URL = 'http://google.com';

class TestClass {
    constructor(){
        // super()
    }
}

class App extends React.Component {
    constructor (){
        super();
    }

    render(){
        return(
            <div>
                <h1>Hello</h1>
                <Silk number={2}/>
            </div>
        );
    }
}