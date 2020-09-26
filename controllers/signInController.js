export const handleSignIn = async (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  try {

    if((!email || !password)) throw new Error("inválido");

    const data = await db.select('email', 'hash').from('login').where({ email }).first();
    

    if (bcrypt.compareSync(password, data.hash)) {
      const user = await db('users').select('*').where({ email }).first();
      return res.json(user);
    }

    return res.status(400).json({ fail: "Não autorizado" });
  } catch (err) {
    return res.status(500).json({ err: "an error has ocurred" });
  }
}