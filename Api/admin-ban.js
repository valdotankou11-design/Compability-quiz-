const { getAdminClient, checkAdminKey } = require('../lib/supabaseAdmin');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if(!checkAdminKey(req)) return res.status(401).json({ error: 'Clé admin invalide' });

  const { userId, banned } = req.body || {};
  if(!userId || typeof banned !== 'boolean') return res.status(400).json({ error: 'userId et banned (bool) sont requis' });

  const sbAdmin = getAdminClient();
  const { error } = await sbAdmin
    .from('account_status')
    .update({ is_banned: banned })
    .eq('user_id', userId);

  if(error) return res.status(500).json({ error: error.message });
  res.status(200).json({ ok: true });
};
