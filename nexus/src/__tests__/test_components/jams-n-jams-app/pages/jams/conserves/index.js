import React from 'react';
import CardItem from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

export default function Conserves({ conserves }) {
  console.log(conserves);

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {conserves.map(conserve => (
            <CardItem
              id={conserve.id}
              title={conserve.title}
              description={conserve.description}
              price={conserve.price}
              image={conserve.image}
              type={conserve.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('getting conserves');
  const res = await fetch('http://localhost:3000/api/conserves');
  const data = await res.json();
  console.log('got conserves', data);

  return {
    props: {
      conserves: data,
    },
  };
}
