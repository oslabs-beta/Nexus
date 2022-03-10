// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import data from '../../../../data';

export default function handler(req, res) {
  const { id } = req.query;
  const bird = data.birds.find(bird => bird.id === Number(id));
  res.status(200).json(bird);
}
