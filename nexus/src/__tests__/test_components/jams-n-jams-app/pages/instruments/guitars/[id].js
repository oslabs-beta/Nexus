import React from 'react';
import Nav from '../../../components/Nav/Nav';

export default function Guitar({ guitar }) {
  return (
    <div>
      <Nav />
      {guitar && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={guitar.image.url} alt={guitar.image.alt} />
          <div className="mx-5">
            <h1>{guitar.title}</h1>
            <p>{guitar.description}</p>
            <p>{guitar.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/guitars');
  const data = await res.json();

  const paths = data.map(guitar => ({
    params: { id: guitar.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('in get static props guitars');
  const res = await fetch(`http://localhost:3000/api/guitars/${params.id}`);
  const data = await res.json();
  return { props: { guitar: data } };
}
