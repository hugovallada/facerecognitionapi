import Clarifai from 'clarifai'
import { response } from 'express';

const app = new Clarifai.App({
  //TODO: Colcoar a api key
  apiKey: 'ce4988a129e94b0694447967a80ab6a8',
});

// export const handleApiCall = (req, res) => {
//   app.models
//     .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => res.status(400).json('Unable to work with API'));
// }

// msm coisa q o de cima, mas com async/await
export const handleApiCall = async (req, res) => {
  try{
  const response = await app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input);
  const data = await response.json();
  res.json(data);
  }catch(err) {
    console.log("RESPONSE: ", response);
    console.log(err);
    res.status(400).json("Unable to work with the API")
  }

}

export const handleImage = async (req, res, db) => {
  const { id } = req.body;
  try {

    const entries = await db('users').where({ id }).increment('entries', 1).returning('entries');
    return res.json(entries[0]);

  } catch (err) {
    return res.status(400).json({ fail: 'User not found' });
  }
}