// Example React component for testing parser logic.

import React from 'react';
import { Link } from 'react-router-dom';
import Chatrooms from './components/Chatrooms.jsx';
import Chatroom from './components/Chatroom.jsx';
import styles from './styles.css';
import Children from './Children.jsx';
import ScuttleCrab from './ScuttleCrab.jsx';

const URL = 'http://google.com';
const NUMBER = 10;
function FUNC() {
  console.log('func');
}
const FUNCTWO = () => {
  return 2;
};

export async function getStaticProps() {
  const allPostsData = 'function';
  return {
    props: {
      allPostsData,
    },
  };
}

const App = props => {
  const socket = io();

  return (
    <div>
      {/* <button onClick={useRouter}></button> */}
      {/* <Chatroom name={'Brian'} otherProp={500}/> */}
      {/* <Chatrooms name={'Mike'} otherProp={600}/> */}
      {/* <Link href="/dogs">
        <a>click me for dogs</a>
      </Link> */}
      <Children name={'Brian'} otherProp={500} />
      <Children name={'David'} otherProp={300} />
      <Children name={'Nico'} otherProp={100} />
      <Children name={'Alex'} otherProp={400} />
      <Children name={'Mike'} otherProp={600} />
      <Comp name={'Test'} />
      <ScuttleCrab name={'pls'} />
      <button>HTML Button</button>
    </div>
  );
};

export default { App, URL };