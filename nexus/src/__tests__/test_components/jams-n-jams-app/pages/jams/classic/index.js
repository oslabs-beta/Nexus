import React from 'react';
import CardItem from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

// jams/classic/index.js
export default function Classics({ classics }) {
  console.log(classics);

  // ComponentNode {name: /jams/classics, props: {classics: from getStaticProps}, children: [Nav, CardItem], datafetching: ssg  }
  // ComponentNode{name: CardItem, props: {
  //     title: 'from /jams/classic/index.js', description: 'from jams/classic/index.js', ...
  //}}
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {classics.map(classic => (
            <CardItem
              id={classic.id}
              title={classic.title}
              description={classic.description}
              price={classic.price}
              image={classic.image}
              type={classic.type}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log('getting classics');
  const res = await fetch('http://localhost:3000/api/classics');
  const data = await res.json();
  console.log('got classics', data);

  return {
    props: {
      classics: data,
    },
  };
}
