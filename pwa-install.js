// Propose activement l'installation de la PWA au lieu d'attendre le bandeau
// automatique de Chrome (peu fiable — dépend de son propre algorithme
// d'engagement). Inclus sur les 4 pages via <script src="pwa-install.js">.
(function(){
  let deferredPrompt = null;

  function isStandalone(){
    // Déjà installée / déjà ouverte en mode application : inutile de proposer.
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function createBanner(){
    if(document.getElementById('pwa-install-banner') || isStandalone()) return;

    const style = document.createElement('style');
    style.textContent = `
      #pwa-install-banner{
        position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;
        display:flex;align-items:center;gap:12px;
        background:linear-gradient(90deg,#ff7aa8,#ffcb66);
        color:#100c1c;padding:14px 16px;border-radius:14px;
        box-shadow:0 10px 30px rgba(0,0,0,0.4);
        font-family:'Poppins',sans-serif;
        animation:pwaBannerRise .3s ease;
      }
      @keyframes pwaBannerRise{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
      #pwa-install-banner span{font-size:13.5px;font-weight:600;flex:1;line-height:1.3;}
      #pwa-install-banner button{
        border:none;border-radius:10px;padding:9px 14px;font-weight:700;
        font-family:'Poppins',sans-serif;font-size:13px;cursor:pointer;flex-shrink:0;
      }
      #pwa-install-btn{background:#100c1c;color:#f3ecdd;}
      #pwa-install-dismiss{background:transparent;color:#100c1c;opacity:.65;padding:9px 8px;}
    `;
    document.head.appendChild(style);

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <span>Installer l'application sur ton écran d'accueil ?</span>
      <button id="pwa-install-dismiss">Non merci</button>
      <button id="pwa-install-btn">Installer</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      banner.remove();
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });

    document.getElementById('pwa-install-dismiss').addEventListener('click', () => {
      banner.remove();
      // On ne re-propose pas pendant le reste de cette session de navigation ;
      // une nouvelle visite (nouvelle session) le repropose normalement.
      sessionStorage.setItem('pwaInstallDismissed', '1');
    });
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if(sessionStorage.getItem('pwaInstallDismissed') === '1') return;
    createBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    if(banner) banner.remove();
  });
})();
