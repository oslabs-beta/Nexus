import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav/Nav';

export default function Conserve() {
  const [conserve, setConserve] = useState();

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const response = await fetch(`/api/jams/conserves/${id}`);
    const data = await response.json();
    setConserve(data);
  }, []);

  return (
    <div>
      <Nav />
      {conserve && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={conserve.image.url} alt={conserve.image.alt} />
          <div className="mx-5">
            <h1>{conserve.name}</h1>
            <p>{conserve.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
