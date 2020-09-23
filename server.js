import express from 'express';
import database from './db.js';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();cl

app.use(cors());

const findUser = (id) => {
  let usuario;
  database.users.forEach(user => {
    if (user.id === id) {
      usuario = user;
    }
  });
  return usuario;
};

app.use(express.urlencoded());
app.use(express.json());


app.get('/',(req, res) => {
  res.json({users: database.users});
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // if ((email === database.users[2].email) && (bcrypt.compareSync(password,database.users[2].password))) {
  //   return res.json({ success: "Autorizado" })
  // }
if((email === database.users[0].email) && (password === database.users[0].password)){
  return res.json(database.users[0]);
}

  return res.status(400).json({ fail: "Não autorizado" });
})


app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const passwordHash = bcrypt.hashSync(password,10);

  try {
    database.users.push({
      id: '125',
      name: name,
      email: email,
      password: passwordHash,
      entries: 0,
      joined: new Date(),
    });

    const ultimo = database.users.length - 1;

    return res.json({ user: database.users[ultimo] });
  } catch (err) {
    return res.json({ fail: "Failed" });
  }
});


app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  // database.users.forEach(user => {
  //   if(user.id === id){
  //     return res.json({user: user});
  //   }
  // });

  const usuario = findUser(id);

  if (usuario) return res.json({ user: usuario })

  return res.status(400).json({ fail: "Usuário Não Encontrado" });
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = findUser(id);

  if (user) {
    user.entries++;
    return res.json(user.entries);
  }

  return res.status(400).json({ fail: 'User not found' });
})


app.listen(3001, () => {
  console.log("Server iniciado em localhost:3001/");
});


// API Design

/**
 *  / --> res = this is working
 *  /signin --> POST = success/fail
 *  /register --> POST = user
 *  /profile/:userId --> GET = user
 *  /image --> PUT = user
 */