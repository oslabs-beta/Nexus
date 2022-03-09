// Example React component for testing parser logic.

import React from 'react';
import { Link } from 'react-router-dom';
import Chatrooms from './components/Chatrooms.jsx';
import Chatroom from './components/Chatroom.jsx'; 
import styles from './styles.css';
import Children from './Children.jsx';
import ScuttleCrab from './ScuttleCrab.jsx';
import SSRComponent from './SSRComponent.jsx';

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
      {/* <Link href="/test">
        <a>click me for test</a>
      </Link> */}
      <Children name={'Brian'} class="children" otherProp={500} />
      <Children name={'David'} class="children" otherProp={300} />
      <Children name={'Nico'} class="children" otherProp={100} />
      <Children name={'Alex'} class="children" otherProp={400} />
      <Children name={'Mike'} class="children" otherProp={600} />
      <Comp name={'Test'} />
      <ScuttleCrab name={'pls'} />
      <SSRComponent />
      <button>HTML Button</button>
    </div>
  );
};

export default { App, URL };
