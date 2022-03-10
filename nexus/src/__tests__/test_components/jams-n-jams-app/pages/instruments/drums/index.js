import React from 'react';
import CardItem from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

export default function Drums({ drums }) {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {drums.map(drum => (
            <CardItem
              id={drum.id}
              title={drum.title}
              description={drum.description}
              price={drum.price}
              image={drum.image}
              type={drum.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('getting drums');
  const res = await fetch('http://localhost:3000/api/drums');
  const data = await res.json();
  console.log('got drums', data);

  return {
    props: {
      drums: data,
    },
  };
}
