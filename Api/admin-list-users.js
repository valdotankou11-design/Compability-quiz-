const { getAdminClient, checkAdminKey } = require('../lib/supabaseAdmin');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if(!checkAdminKey(req)) return res.status(401).json({ error: 'Clé admin invalide' });

  const sbAdmin = getAdminClient();

  // Compte des comptes auth (email + date de création), jusqu'à 1000 users.
  const { data: authData, error: authError } = await sbAdmin.auth.admin.listUsers({ perPage: 1000 });
  if(authError) return res.status(500).json({ error: authError.message });

  const { data: profiles } = await sbAdmin.from('profiles').select('*');
  const { data: statuses } = await sbAdmin.from('account_status').select('*');
  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));
  const statusMap = Object.fromEntries((statuses || []).map(s => [s.user_id, s]));

  const users = authData.users.map(u => ({
    id: u.id,
    email: u.email,
    username: profileMap[u.id] ? profileMap[u.id].username : null,
    is_banned: statusMap[u.id] ? statusMap[u.id].is_banned : false,
    pro_until: statusMap[u.id] ? statusMap[u.id].pro_until : null,
    created_at: u.created_at
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.status(200).json({ users });
};
