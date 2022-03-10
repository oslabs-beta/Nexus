import React from 'react';
import Nav from '../../../components/Nav/Nav';

export default function Keyboard({ keyboard }) {
  return (
    <div>
      <Nav />
      {keyboard && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={keyboard.image.url} alt={keyboard.image.alt} />
          <div className="mx-5">
            <h1>{keyboard.title}</h1>
            <p>{keyboard.description}</p>
            <p>{keyboard.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/keyboards');
  const data = await res.json();

  const paths = data.map(keyboard => ({
    params: { id: keyboard.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('in get static props keyboards');
  const res = await fetch(`http://localhost:3000/api/keyboards/${params.id}`);
  const data = await res.json();
  return { props: { keyboard: data } };
}
