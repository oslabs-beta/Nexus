import React from 'react';
import Nav from '../../../components/Nav/Nav';

export default function Submit() {
  function handleSubmit() {
    fetch('http://localhost:3000/api/events/post', { method: 'POST' });
  }

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <h1>Submit an Event (aka, a jam to jam and jam)!</h1>
          <form onSubmit={handleSubmit}>
            <input type="text">
              <label>Name of Band</label>
            </input>
            <input type="text">
              <label>Website</label>
            </input>
            <input type="text">
              <label>Desired Date</label>
            </input>
            <button>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
