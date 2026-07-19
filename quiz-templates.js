// Lots de quiz prêts à l'emploi, par catégorie — réservés aux comptes Pro.
// Chaque question ne contient QUE le texte + les 4 options : la bonne
// réponse n'est jamais pré-remplie ici, puisqu'elle dépend de la personne
// qui utilise le lot (chacun a ses propres réponses). C'est choisi au
// moment où le lot est appliqué, dans le dashboard.
const QUIZ_TEMPLATES = [
  {
    id: 'cinema',
    label: 'Cinéma & Séries',
    emoji: '🎬',
    free: true, // seule catégorie accessible en version gratuite (avant-goût) ; les autres sont réservées au Pro
    questions: [
      { text: "Quel genre de film te fait vibrer ?", options: ["Action / cascades", "Comédie", "Drame profond", "Science-fiction"] },
      { text: "Ta plateforme de streaming préférée ?", options: ["Netflix", "Disney+", "Prime Video", "Je préfère le cinéma"] },
      { text: "Un film peut durer combien de temps avant que tu décroches ?", options: ["Peu importe, si c'est bon", "Max 2h", "Je préfère les formats courts (séries)", "Ça dépend totalement du film"] },
      { text: "Séries terminées d'une traite (binge) ou un épisode à la fois ?", options: ["Toute la saison d'un coup", "Un épisode par jour maximum", "Ça dépend de mon emploi du temps", "Je n'accroche jamais assez pour binger"] },
      { text: "Ton univers ou réalisateur préféré ?", options: ["Grosse production, effets spéciaux", "Animation (Ghibli, Pixar...)", "Films de super-héros", "Cinéma d'auteur, moins connu"] },
      { text: "Les remakes et suites, tu en penses quoi ?", options: ["J'adore, plus il y en a mieux c'est", "Seulement si c'est bien fait", "Je préfère les histoires originales", "Ça m'est égal"] },
      { text: "Regarder un film, c'est plutôt...", options: ["Une sortie au cinéma, un événement", "Une soirée cocooning à la maison", "En fond pendant que je fais autre chose", "Rare, je préfère les séries"] },
      { text: "VO sous-titrée ou VF ?", options: ["VO sous-titrée, toujours", "VF, plus confortable", "Ça dépend de la langue d'origine", "Peu importe"] }
    ]
  },
  {
    id: 'anime-gaming',
    label: 'Jeux vidéo & Anime',
    emoji: '🎮',
    questions: [
      { text: "Anime ou manga, tu préfères ?", options: ["Anime (l'animation)", "Manga (la lecture)", "Les deux à égalité", "Ni l'un ni l'autre"] },
      { text: "Ton genre de jeu vidéo préféré ?", options: ["RPG / monde ouvert", "FPS / compétitif", "Jeux narratifs", "Jeux mobiles / casual"] },
      { text: "Combien de temps par semaine tu joues ?", options: ["Tous les jours", "Quelques fois par semaine", "Rarement", "Jamais"] },
      { text: "Jouer en solo ou en équipe ?", options: ["Solo, tranquille", "En équipe / multijoueur", "Ça dépend du jeu", "Je ne joue pas"] },
      { text: "Un anime culte pour toi, c'est plutôt...", options: ["Un classique intemporel", "Une pépite peu connue", "Le dernier à la mode", "Je ne regarde pas d'anime"] },
      { text: "Console, PC ou mobile ?", options: ["Console", "PC", "Mobile", "Aucun des trois"] },
      { text: "Une convention ou un évènement otaku : ça te tente ?", options: ["Direct oui, j'adore l'ambiance", "Pourquoi pas, une fois", "Pas trop mon truc", "Jamais entendu parler"] },
      { text: "Ton rapport au cosplay ?", options: ["J'en fais ou j'adorerais en faire", "J'aime regarder mais pas en faire", "Ça ne m'intéresse pas", "Je ne connais pas bien"] }
    ]
  },
  {
    id: 'cuisine',
    label: 'Cuisine & Gastronomie',
    emoji: '🍽️',
    questions: [
      { text: "Cuisine que tu préfères manger ?", options: ["Cuisine locale / traditionnelle", "Cuisine asiatique", "Cuisine italienne", "J'aime tout tester"] },
      { text: "Tu cuisines toi-même ou tu préfères qu'on cuisine pour toi ?", options: ["J'adore cuisiner", "Je cuisine par nécessité", "Je préfère qu'on me prépare à manger", "Je commande / mange dehors"] },
      { text: "Le piment, ton rapport avec ?", options: ["Plus c'est fort, mieux c'est", "Un peu de piquant, ça va", "Je n'aime pas du tout", "Ça dépend du plat"] },
      { text: "Sucré ou salé, ton camp ?", options: ["Sucré", "Salé", "Les deux à parts égales", "Ni l'un ni l'autre particulièrement"] },
      { text: "Manger dehors, tu préfères...", options: ["Un grand restaurant", "Street food / petit resto local", "Fast-food, simple et rapide", "Je préfère rester à la maison"] },
      { text: "Un repas parfait, c'est plutôt...", options: ["En groupe, convivial et animé", "En tête à tête, calme", "Seul, tranquille", "Peu importe la compagnie"] },
      { text: "Découvrir un plat inconnu, ça te tente ?", options: ["Toujours partant", "Seulement si on me rassure sur le goût", "Je préfère ce que je connais déjà", "Ça dépend de mon humeur"] },
      { text: "Le petit-déjeuner, pour toi c'est...", options: ["Sacré, jamais sauté", "Rapide et léger", "Souvent zappé", "Copieux le week-end seulement"] }
    ]
  },
  {
    id: 'voyage',
    label: 'Voyage & Aventure',
    emoji: '✈️',
    questions: [
      { text: "Ton type de destination préférée ?", options: ["Plage et détente", "Grande ville animée", "Nature et randonnée", "Découverte culturelle / historique"] },
      { text: "Tu voyages plutôt...", options: ["Avec un plan détaillé", "À l'improviste", "Avec un mix des deux", "Je ne voyage pas beaucoup"] },
      { text: "Le budget voyage, c'est...", options: ["Je mets le prix pour le confort", "Je cherche à économiser au max", "Un équilibre entre les deux", "Ça dépend de la destination"] },
      { text: "Voyager seul(e) ou accompagné(e) ?", options: ["Seul(e), en totale liberté", "En groupe / famille", "En couple", "Peu importe, tant que je voyage"] },
      { text: "L'avion, le train ou la route ?", options: ["L'avion, le plus rapide possible", "Le train, plus posé", "La route, l'aventure du trajet", "Peu importe le moyen"] },
      { text: "Un voyage réussi, c'est surtout...", options: ["Voir un maximum de choses", "Se reposer et déconnecter", "Rencontrer des gens locaux", "Vivre une expérience marquante"] },
      { text: "Camping ou hôtel ?", options: ["Camping, au plus près de la nature", "Hôtel, confort avant tout", "Logement chez l'habitant", "Ça dépend du voyage"] },
      { text: "Ton prochain rêve de destination ?", options: ["Un pays lointain, dépaysement total", "Redécouvrir mon propre pays", "Une ville précise que je connais déjà", "Pas de destination de rêve précise"] }
    ]
  },
  {
    id: 'musique',
    label: 'Musique',
    emoji: '🎵',
    questions: [
      { text: "Ton genre musical principal ?", options: ["Afrobeat / musiques locales", "Hip-hop / rap", "Pop / variété", "Autre (rock, électro, jazz...)"] },
      { text: "Écouter de la musique, c'est plutôt...", options: ["En fond toute la journée", "À des moments précis (sport, trajet...)", "Rarement, ça dépend de l'humeur", "Très important, presque tout le temps"] },
      { text: "Concert ou festival, ton dernier souvenir ?", options: ["Récent, j'y vais souvent", "Ça fait longtemps", "Jamais eu l'occasion", "Pas vraiment intéressé(e)"] },
      { text: "Découvrir de nouveaux artistes ?", options: ["Toujours en quête de nouveauté", "Je reste fidèle à mes artistes préférés", "Je découvre via les recommandations", "Je n'y prête pas trop attention"] },
      { text: "Chanter ou jouer d'un instrument ?", options: ["Oui, régulièrement", "Un peu, pour le plaisir", "Jamais essayé", "J'aimerais bien apprendre"] },
      { text: "La musique en langue étrangère, ça te dérange ?", options: ["Pas du tout, la mélodie suffit", "Je préfère comprendre les paroles", "Ça dépend du genre", "Je n'écoute que dans ma langue"] },
      { text: "Playlist perso ou radio / algorithme ?", options: ["Playlist que je construis moi-même", "Je laisse l'algorithme proposer", "La radio, simple et efficace", "Un mix des trois"] },
      { text: "La musique pendant le travail / les études ?", options: ["Indispensable pour me concentrer", "Ça me déconcentre, j'évite", "Seulement une musique sans paroles", "Ça dépend de la tâche"] }
    ]
  }
];
