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
        console.log("Pos1")
        trx.insert({
          hash: passwordHash,
          email: email
        })
          .into('login')
          .returning('email')
          .then(loginEmail => {
            console.log("Errrrrr");
            trx('users')
              .returning('*')
              .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date(),
              })
              .then(user => {
                console.log('pos2')
                return res.json(user[0]);
              })
              .then(trx.commit)
              .catch((err) => {
                console.log('ROllback');
                trx.rollback;
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