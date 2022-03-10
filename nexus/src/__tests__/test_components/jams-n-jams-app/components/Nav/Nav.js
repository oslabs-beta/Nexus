import React from 'react';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <Link href="/" class="navbar-brand mb-0 h1">
          Home
        </Link>
        <Link href="/pets" class="navbar-brand mb-0 h1">
          Pets
        </Link>
        <Link href="/instruments" class="navbar-brand mb-0 h1">
          Instruments
        </Link>
        <Link href="/events" class="navbar-brand mb-0 h1">
          Events
        </Link>
      </div>
    </nav>
  );
}
