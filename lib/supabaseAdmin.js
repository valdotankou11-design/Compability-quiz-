// Helper partagé par toutes les fonctions /api/admin-*.js
// ⚠️ Ce fichier tourne uniquement côté serveur (Vercel). Il utilise la clé
// "service_role", jamais envoyée au navigateur, lue depuis les variables
// d'environnement Vercel (Project Settings → Environment Variables) :
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
//   - SUPER_ADMIN_KEY  (le mot de passe que Joël tape sur /admin.html)

const { createClient } = require('@supabase/supabase-js');

function getAdminClient(){
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Vérifie que la requête porte bien la clé super-admin dans son header.
// C'est cette vérification côté serveur (et non un simple contrôle dans le
// navigateur) qui protège vraiment les actions sensibles.
function checkAdminKey(req){
  const provided = req.headers['x-admin-key'];
  return !!provided && !!process.env.SUPER_ADMIN_KEY && provided === process.env.SUPER_ADMIN_KEY;
}

function randomTempPassword(){
  // Mot de passe temporaire lisible, suffisamment aléatoire pour un usage
  // ponctuel (à transmettre à l'utilisateur, qui devra le changer).
  const part = () => Math.random().toString(36).slice(2, 8);
  return `${part()}-${part()}`;
}

module.exports = { getAdminClient, checkAdminKey, randomTempPassword };

