import React from 'react';
import { useRouter } from 'next/router';

export default function Splash() {
  const router = useRouter();

  return (
    <div class="jumbotron jumbotron-fluid mt-5">
      <div class="container">
        <h1 class="display-4">Jams n Jams. N Jams.</h1>
        <p class="lead">Instruments and Canned Confections. And live jams. All in one place.</p>
        <p>Show me...</p>
        <button type="button" class="btn btn-primary" onClick={() => router.push('/jams')}>
          Jams
        </button>
        <button type="button" class="btn btn-primary" onClick={() => router.push('/instruments')}>
          Instruments
        </button>
        <button type="button" class="btn btn-primary" onClick={() => router.push('/events')}>
          Events
        </button>
      </div>
    </div>
  );
}
