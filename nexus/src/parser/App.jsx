// Example React component for testing parser logic.

import React from 'react';
import { Link } from 'react-router-dom';
import Chatrooms from './components/Chatrooms.jsx';
import Chatroom from './components/Chatroom.jsx';
import styles from './styles.css'

const URL = "http://google.com";
const NUMBER = 10;
function FUNC() {
    console.log('func');
}
const FUNCTWO = () => {
    return 2;
}

export async function getStaticProps() {
    const allPostsData = 'function';
    return {
        props: {
            allPostsData
        }
    }
}

const App = (props) => {
    const socket = io();

    return (
        <div>
            <Link href="/dogs"><a>click me for dogs</a></Link>
            {/* <button onClick={useRouter}></button> */}
            <Chatroom name={'Brian'} otherProp={500}/>
            <Chatrooms name={'Mike'} otherProp={600}/>
            <button>HTML Button</button>
        </div>
    )
};

export default {App, URL};