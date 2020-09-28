export const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  try {
    if ((!name || !email || !password)) {
      throw new Error('error');
    }
    const passwordHash = bcrypt.hashSync(password, 10);



    db.transaction(trx => {
      trx.insert({
        hash: passwordHash,
        email: email
      })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date(),
            })
            .then(user => {
              return res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback);

    })
      .catch(err => {
        return res.status(400).json('unable to register');
      });



  } catch (err) {
    console.log("O erro foi aqui");
    return res.status(404).json("Incorrect user submition");
  }
}