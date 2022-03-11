import React from 'react';
import CardEvent from '../../../components/Cards/CardItem';
import Nav from '../../../components/Nav/Nav';

export default function Calendar({ events }) {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {events.map(event => (
            <CardEvent
              id={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              description={event.description}
              image={event.image}
              type={event.eventType}
              who={event.who}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServSideProps() {
  console.log('getting events');
  const res = await fetch('http://localhost:3000/api/events/calendar');
  const data = await res.json();
  console.log('got events', data);

  return {
    props: {
      events: data,
    },
  };
}
