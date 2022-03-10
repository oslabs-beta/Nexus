import React from 'react';
import CardItem from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

export default function Marmalades({ marmalades }) {
  console.log(marmalades);

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {marmalades.map(marmalade => (
            <CardItem
              id={marmalade.id}
              title={marmalade.title}
              description={marmalade.description}
              price={marmalade.price}
              image={marmalade.image}
              type={marmalade.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('getting marmalades');
  const res = await fetch('http://localhost:3000/api/marmalades');
  const data = await res.json();
  console.log('got marmalades', data);

  return {
    props: {
      marmalades: data,
    },
  };
}
