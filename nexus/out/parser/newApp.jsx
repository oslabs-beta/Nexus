import React from 'react';
import Milk from './Milk.jsx';

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
                <Milk number={2}/>
            </div>
        );
    }
}