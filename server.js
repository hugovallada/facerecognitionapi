import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';



import { handleRegister } from './controllers/registerController.js';
import { handleSignIn } from './controllers/signInController.js';
import { handleProfile } from './controllers/profileController.js'
import {handleImage, handleApiCall} from './controllers/imageController.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
  }
});



const app = express();

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {res.send("It's on!!!")})


// dependency injection, inicia as variaveis aqui e passa
app.post('/signin', (req, res) => {handleSignIn(req, res, db, bcrypt)});

// dependency injection
app.post('/register',(req, res) =>{handleRegister(req, res, db, bcrypt)});

// dependency injection - outra maneira de fazer o msm q em cima
app.get('/profile/:id', (req, res) => handleProfile(db)(req, res));

app.put('/image', (req, res) => {handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {handleApiCall(req, res)});



app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}}`);
});


// API Design

/**
 *  / --> res = this is working
 *  /signin --> POST = success/fail
 *  /register --> POST = user
 *  /profile/:userId --> GET = user
 *  /image --> PUT = user
 */