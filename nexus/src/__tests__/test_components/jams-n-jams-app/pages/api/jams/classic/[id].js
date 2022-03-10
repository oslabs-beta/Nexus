import data from '../../../data';

console.log('in api/dogs/id');

export default function handler(req, res) {
  console.log(req);
  const { id } = req.query;
  console.log(id);
  console.log(data.dogs);
  const curDog = data.dogs.find(dog => dog.id === Number(id));
  console.log(curDog);
  res.status(200).json(curDog);
}
