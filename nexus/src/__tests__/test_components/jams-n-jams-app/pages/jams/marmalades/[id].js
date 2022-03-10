import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav/Nav';

export default function Marmalade() {
  const [marmalade, setMarmalade] = useState();

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    const response = await fetch(`/api/jams/marmalades/${id}`);
    const data = await response.json();
    setMarmalade(data);
  }, []);

  return (
    <div>
      <Nav />
      {marmalade && (
        <div className="container mt-5 flex" style={{ display: 'flex' }}>
          <img src={marmalade.image.url} alt={marmalade.image.alt} />
          <div className="mx-5">
            <h1>{marmalade.name}</h1>
            <p>{marmalade.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
