import React from 'react';
import Nav from '../../../components/Nav/Nav';

export default function Event({ event }) {
  const [event, setEvent] = useState();

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const response = await fetch(`/api/events/calendar/${id}`);
    const data = await response.json();
    setEvent(data);
  }, []);

  return (
    <div>
      <Nav />
      {event && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={event.image.url} alt={event.image.alt} />
          <div className="mx-5">
            <h1>{event.title}</h1>
            <p>{event.date}</p>
            <p>{event.time}</p>
            <p>{event.eventType}</p>
            <p>{event.description}</p>
            <p>{event.who}</p>
          </div>
        </div>
      )}
    </div>
  );
}
