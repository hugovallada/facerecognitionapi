export const handleProfile =  (db) =>  async (req, res) => {
  const { id } = req.params;

  //const usuario = await db.select('*').from('users').where({id}).first();
  const user = await db('users').where({ id }).first();

  if (user) return res.json(user)

  return res.status(400).json({ fail: "User not found" });
}