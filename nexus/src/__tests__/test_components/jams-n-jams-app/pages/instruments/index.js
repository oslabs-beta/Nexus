import React from 'react';
import { useRouter } from 'next/router';

export default function Instruments() {
  const router = useRouter();

  return (
    <div>
      <div>

        <h1>Check out our amazing selection of instruments (with which you can mostcertainly jam)</h1>

        <button onClick={() => router.push('/instruments/guitars')}>Guitars</button>
        <button onClick={() => router.push('/instruments/keyboards')}>Keyboards</button>
        <button onClick={() => router.push('/instruments/drums')}>Drums</button>
      </div>
    </div>
  );
}
