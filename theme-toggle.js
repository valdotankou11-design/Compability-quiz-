// Bascule clair / sombre — à charger sur toutes les pages (index, dashboard, quiz, admin)
// <script src="theme-toggle.js"></script>
(function(){
  const root = document.documentElement;
  // Clé propre à CHAQUE page (index, dashboard, admin, quiz...) : basculer
  // le thème sur une page ne doit affecter aucune autre page.
  let pageName = window.location.pathname.split('/').pop();
  if(!pageName) pageName = 'index.html'; // '/' -> page d'accueil
  const KEY = 'cq-theme-' + pageName.replace(/\.html$/, '');

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
