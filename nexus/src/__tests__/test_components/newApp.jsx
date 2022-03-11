import React from 'react';
import Child from './Child.jsx';

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
                <Child number={2}/>
            </div>
        );
    }
}