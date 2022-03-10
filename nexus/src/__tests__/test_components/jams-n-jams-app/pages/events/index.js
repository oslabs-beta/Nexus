import React from 'react';
import { useRouter } from 'next/router';

export default function Events() {
  const router = useRouter();

  return (
    <>
    <div>
      <h1>Check out all the jams with have coming up (to jam along to)</h1>
      <button onClick={() => router.push('/events/calendar')}>Calendar</button>
      <button onClick={() => router.push('/events/past')}>Past Events</button>
      <button onClick={() => router.push('/events/submit')}>Submit Event</button>
    </div>
    </>
  );
}
