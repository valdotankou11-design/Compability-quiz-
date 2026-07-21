// Bascule clair / sombre — à charger sur toutes les pages (index, dashboard, quiz, admin)
// <script src="theme-toggle.js"></script>
(function(){
  const root = document.documentElement;
  // Clé séparée pour quiz.html (page publique, vue par le répondant) : sans
  // ça, le thème choisi par un répondant se retrouvait appliqué au retour
  // sur le dashboard du créateur, les deux pages partageant le même
  // localStorage (même domaine).
  const isPublicQuizPage = window.location.pathname.endsWith('quiz.html');
  const KEY = isPublicQuizPage ? 'cq-theme-quiz' : 'cq-theme-app';

  // 1. Applique le thème AVANT que la page ne s'affiche (évite le flash)
  let theme = localStorage.getItem(KEY);
  if(!theme){
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  if(theme === 'light') root.setAttribute('data-theme', 'light');

  // 2. Injecte le bouton flottant une fois le <body> disponible
  function initToggle(){
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Changer de thème');
    btn.textContent = root.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';

    btn.addEventListener('click', function(){
      const isLight = root.getAttribute('data-theme') === 'light';
      if(isLight) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'light');
      localStorage.setItem(KEY, isLight ? 'dark' : 'light');
      btn.textContent = isLight ? '🌙' : '☀️';
    });

    document.body.appendChild(btn);
  }

  if(document.body) initToggle();
  else document.addEventListener('DOMContentLoaded', initToggle);
})();
