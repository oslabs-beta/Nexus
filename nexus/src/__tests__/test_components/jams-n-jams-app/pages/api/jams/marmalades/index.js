// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import data from '../../../data';

console.log('i am data in index.js in api/cats', data);

export default function handler(req, res) {
  res.status(200).json(data.cats);
}

// http://localhost:3000/api/cats
