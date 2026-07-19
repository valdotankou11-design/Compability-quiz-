/* ==========================================================================
   Config partagée par toutes les pages.
   ⚠️ SUPABASE_ANON_KEY est une clé PUBLIQUE : c'est normal qu'elle soit ici,
   en clair, côté client. La vraie sécurité vient des règles Row Level
   Security côté base de données, pas de cette clé.
   La clé "service_role" (privilégiée) ne doit JAMAIS apparaître dans ce
   fichier ni dans aucun fichier servi au navigateur — elle vit uniquement
   dans les variables d'environnement Vercel, utilisées par /api/*.js.
   ========================================================================== */

// URL et clé publique de ton projet Supabase dédié à ce site.
const SUPABASE_URL = "https://afskevjbfukmtvamfqgr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmc2tldmpiZnVrbXR2YW1mcWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDYxMTUsImV4cCI6MjA5OTg4MjExNX0.ch680UtnhYPlAbjzPFSY5GwwAiZRjYwvM8xlC1h7MN4";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Numéro WhatsApp de Joël pour les demandes de version Pro.
const JOEL_WHATSAPP = "237675299802";

// Les 3 paliers de la version Pro : label affiché + durée réelle en jours +
// prix affiché. (Les durées ne correspondent pas exactement aux libellés
// "6 mois"/"1 an" — c'est voulu, ce sont les valeurs données par Joël.)
const PRO_PLANS = [
  { label: "1 mois",  days: 30,  price: "500 FCFA" },
  { label: "6 mois",  days: 180, price: "2000 FCFA" },
  { label: "1 an",    days: 360, price: "3500 FCFA" }
];

// Construit le lien WhatsApp pré-rempli pour souscrire à un palier Pro.
function buildProWhatsAppLink(username, days){
  const msg = `${username}\nje veux la version pro pour ${days} jours`;
  return `https://wa.me/${JOEL_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
