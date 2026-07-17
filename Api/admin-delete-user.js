const { getAdminClient, checkAdminKey } = require('../lib/supabaseAdmin');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if(!checkAdminKey(req)) return res.status(401).json({ error: 'Clé admin invalide' });

  const { userId } = req.body || {};
  if(!userId) return res.status(400).json({ error: 'userId est requis' });

  const sbAdmin = getAdminClient();
  // Supprime le compte d'authentification ; profiles / account_status /
  // quizzes / quiz_questions / quiz_responses / quiz_response_answers
  // disparaissent en cascade grâce aux clés étrangères "on delete cascade".
  const { error } = await sbAdmin.auth.admin.deleteUser(userId);
  if(error) return res.status(500).json({ error: error.message });

  res.status(200).json({ ok: true });
};
