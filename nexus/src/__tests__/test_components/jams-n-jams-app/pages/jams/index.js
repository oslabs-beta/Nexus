import React from 'react';
import { useRouter } from 'next/router';

export default function Jams() {
  const router = useRouter();

  return (
    <div>
      <div>
        <Nav />
        <h1>Check out our amazing selection of jams (you know, the kind that are actually jams)</h1>
        <button onClick={() => router.push('/jams/classic')}>Classic Jams</button>
        <button onClick={() => router.push('/jams/conserves')}>Conserves</button>
        <button onClick={() => router.push('/jams/marmalades')}>Marmalades</button>
      </div>
    </div>
  );
}
