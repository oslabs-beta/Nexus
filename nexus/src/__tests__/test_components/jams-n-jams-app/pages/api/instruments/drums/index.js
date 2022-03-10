import data from '../../../data';

console.log('i am on the index.js in api/dogs');

export default function handler(req, res) {
  res.status(200).json(data.dogs);
}
