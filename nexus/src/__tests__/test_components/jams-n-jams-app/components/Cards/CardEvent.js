import { useRouter } from 'next/router';
import React from 'react';
import styles from './Card.module.css';

export default function CardEvent({ title, date, time, who, description, id, eventType, image }) {
  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => {
        router.push(`event/${id}`);
      }}
    >
      <div className={styles['card-header']}>
        <img src={image.url} alt={image.alt} className={styles['card-img']} />
      </div>
      <div className={styles['cardContent']}>
        <h3>{title}</h3>
        <p>{date}</p>
        <p>{time}</p>
        <p>{eventType}</p>
        <p>{description}</p>
        <p>{who}</p>
      </div>
    </div>
  );
}
