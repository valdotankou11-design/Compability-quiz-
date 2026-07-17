const { getAdminClient, checkAdminKey } = require('../lib/supabaseAdmin');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if(!checkAdminKey(req)) return res.status(401).json({ error: 'Clé admin invalide' });

  const { userId, days } = req.body || {};
  if(!userId || !days || days < 1) return res.status(400).json({ error: 'userId et days (>0) sont requis' });

  const sbAdmin = getAdminClient();
  const proUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await sbAdmin
    .from('account_status')
    .update({ pro_until: proUntil })
    .eq('user_id', userId);

  if(error) return res.status(500).json({ error: error.message });
  res.status(200).json({ ok: true, pro_until: proUntil });
};
