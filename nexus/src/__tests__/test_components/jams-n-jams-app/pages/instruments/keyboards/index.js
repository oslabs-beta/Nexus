import React from 'react';
import CardItem from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

export default function Keyboards({ keyboards }) {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {keyboards.map(keyboard => (
            <CardItem
              id={keyboard.id}
              title={keyboard.title}
              description={keyboard.description}
              price={keyboard.price}
              image={keyboard.image}
              type={keyboard.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('getting keyboards');
  const res = await fetch('http://localhost:3000/api/keyboards');
  const data = await res.json();
  console.log('got keyboards', data);

  return {
    props: {
      keyboards: data,
    },
  };
}
