import React from 'react';
import CardItem from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

export default function Guitars({ guitars }) {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {guitars.map(guitar => (
            <CardItem
              id={guitar.id}
              title={guitar.title}
              description={guitar.description}
              price={guitar.price}
              image={guitar.image}
              type={guitar.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('getting guitars');
  const res = await fetch('http://localhost:3000/api/guitars');
  const data = await res.json();
  console.log('got guitars', data);

  return {
    props: {
      guitars: data,
    },
  };
}
