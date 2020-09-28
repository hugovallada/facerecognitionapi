export const handleRegister = (req, res, db, bcrypt) => { 
    const { name, email, password } = req.body;
  
    const passwordHash = bcrypt.hashSync(password, 10);
  
    try {

      if((!name || !email || !password)){
        console.log('errro')
        throw new Error('error');
      }
      console.log("Passou validação");
      db.transaction(trx => {
        trx.insert({
          hash: passwordHash,
          email: email
        })
          .into('login')
          .returning('email')
          .then(loginEmail => {
            trx('users')
              .returning('*')
              .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date(),
              })
              .then(user => {
                return res.json(user[0]);
              })
              .then(trx.commit)
              .catch(err => {
                trx.rollback;
                console.log('ROllback');
                return res.status(400).json("Unable to register");
              })
          })
          .catch(err => {
            console.log("Um erro aconteceu aqui");
            return res.status(400).json('unable to register');
          });
      });
  
    } catch (err) {
      console.log("O erro foi aqui");
      return res.status(404).json("Incorrect user submition" );
    }
  }