import { useRouter } from 'next/router';
import React from 'react';
import styles from './Card.module.css';

export default function CardItem({ title, description, price, image, id, type }) {
  // ComponentNode{name: CardItem, props: {
  //     title: 'from /jams/classic/index.js', description: 'from jams/classic/index.js', ...
  //}}
  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => {
        router.push(`/${type}s/${id}`);
      }}
    >
      <div className={styles['card-header']}>
        <img src={image.url} alt={image.alt} className={styles['card-img']} />
      </div>
      <div className={styles['cardContent']}>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{price}</p>
      </div>
    </div>
  );
}
