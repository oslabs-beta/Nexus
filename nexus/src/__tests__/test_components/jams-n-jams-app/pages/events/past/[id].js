import React from 'react';
import Nav from '../../../components/Nav/Nav';

export default function PastEvent({ pastEvent }) {
  const [pastEvent, setEvent] = useState();

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const response = await fetch(`/api/events/past/${id}`);
    const data = await response.json();
    setEvent(data);
  }, []);

  return (
    <div>
      <Nav />
      {pastEvent && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={pastEvent.image.url} alt={pastEvent.image.alt} />
          <div className="mx-5">
            <h1>{pastEvent.title}</h1>
            <p>{pastEvent.date}</p>
            <p>{pastEvent.time}</p>
            <p>{pastEvent.eventType}</p>
            <p>{pastEvent.description}</p>
            <p>{pastEvent.who}</p>
          </div>
        </div>
      )}
    </div>
  );
}
