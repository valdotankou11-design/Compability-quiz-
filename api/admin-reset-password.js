const { getAdminClient, checkAdminKey, randomTempPassword } = require('../lib/supabaseAdmin');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if(!checkAdminKey(req)) return res.status(401).json({ error: 'Clé admin invalide' });

  const { userId } = req.body || {};
  if(!userId) return res.status(400).json({ error: 'userId est requis' });

  const sbAdmin = getAdminClient();
  const tempPassword = randomTempPassword();

  const { error } = await sbAdmin.auth.admin.updateUserById(userId, { password: tempPassword });
  if(error) return res.status(500).json({ error: error.message });

  // Le mot de passe temporaire n'est jamais stocké : il est renvoyé une seule
  // fois à l'admin, à transmettre lui-même à l'utilisateur concerné.
  res.status(200).json({ ok: true, tempPassword });
};
