import React from 'react';
import Nav from '../../../components/Nav/Nav';

export default function Drum({ drum }) {
  return (
    <div>
      <Nav />
      {drum && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={drum.image.url} alt={drum.image.alt} />
          <div className="mx-5">
            <h1>{drum.title}</h1>
            <p>{drum.description}</p>
            <p>{drum.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/drums');
  const data = await res.json();

  const paths = data.map(drum => ({
    params: { id: drum.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('in get static props drums');
  const res = await fetch(`http://localhost:3000/api/drums/${params.id}`);
  const data = await res.json();
  return { props: { drum: data } };
}
