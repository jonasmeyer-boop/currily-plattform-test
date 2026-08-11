// Gemeinsame Plattform-Navigation: Konto-Menü und mobiles Menü
(function () {
  'use strict';
  const kontoMenue = document.querySelector('.konto-menue');
  const kontoKnopf = kontoMenue ? kontoMenue.querySelector('.konto-chip') : null;
  const burger = document.querySelector('.burger');
  const mobilMenue = document.querySelector('.mobil-menue');

  function schliessen() {
    if (kontoMenue && kontoMenue.classList.contains('offen')) {
      kontoMenue.classList.remove('offen');
      kontoKnopf.setAttribute('aria-expanded', 'false');
    }
    if (mobilMenue && mobilMenue.classList.contains('offen')) {
      mobilMenue.classList.remove('offen');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  }
  window.navMenuesSchliessen = schliessen;

  if (kontoKnopf) kontoKnopf.addEventListener('click', () => {
    const wirdOffen = !kontoMenue.classList.contains('offen');
    schliessen();
    if (wirdOffen) {
      kontoMenue.classList.add('offen');
      kontoKnopf.setAttribute('aria-expanded', 'true');
    }
  });

  if (burger && mobilMenue) burger.addEventListener('click', () => {
    const wirdOffen = !mobilMenue.classList.contains('offen');
    schliessen();
    if (wirdOffen) {
      mobilMenue.classList.add('offen');
      burger.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.konto-chip') || e.target.closest('.burger')) return;
    if (e.target.closest('.konto-blatt') || e.target.closest('.mobil-menue')) {
      if (e.target.closest('a, button')) schliessen();
      return;
    }
    schliessen();
  });

  // Esc schließt zuerst das Menü — und erst ein weiteres Esc den Raum (home.html)
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const offen = (kontoMenue && kontoMenue.classList.contains('offen')) ||
                  (mobilMenue && mobilMenue.classList.contains('offen'));
    if (offen) { schliessen(); e.stopPropagation(); }
  }, true);
})();
