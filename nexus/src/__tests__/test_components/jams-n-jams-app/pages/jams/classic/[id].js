import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav/Nav';

export default function Classic() {
  const [classic, setClassic] = useState();

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const response = await fetch(`/api/jams/classics/${id}`);
    const data = await response.json();
    setClassic(data);
  }, []);

  return (
    <div>
      <Nav />
      {classic && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={classic.image.url} alt={classic.image.alt} />
          <div className="mx-5">
            <h1>{classic.name}</h1>
            <p>{classic.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
