window.raumInit = window.raumInit || {};
window.raumInit["finanzen"] = function (sec) {
  if (sec.dataset.finInit === "1") return;
  sec.dataset.finInit = "1";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.NumberFormat("de-DE");

  /* KPI-Zaehler: zaehlt von 0 auf den Zielwert hoch */
  var zaehler = sec.querySelector(".fin-zaehler");
  if (zaehler && !reduced) {
    var ziel = parseInt(zaehler.getAttribute("data-ziel"), 10);
    var dauer = 1100;
    var start = null;
    var schritt = function (ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dauer, 1);
      var e = 1 - Math.pow(1 - t, 3);
      zaehler.textContent = fmt.format(Math.round(ziel * e)) + " €";
      if (t < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  }

  /* Linie zeichnet sich, Flaeche und Punkte blenden nach */
  var linie = sec.querySelector(".fin-linie");
  var flaeche = sec.querySelector(".fin-flaeche");
  var punkte = sec.querySelector(".fin-punkte");
  if (linie && flaeche && punkte && !reduced) {
    var len = 0;
    try { len = linie.getTotalLength(); } catch (err) { len = 0; }
    if (len > 0) {
      linie.style.strokeDasharray = String(len);
      linie.style.strokeDashoffset = String(len);
      flaeche.style.opacity = "0";
      punkte.style.opacity = "0";
      void linie.getBoundingClientRect();
      linie.style.transition = "stroke-dashoffset 1.2s var(--ease-default)";
      flaeche.style.transition = "opacity .6s var(--ease-default) .7s";
      punkte.style.transition = "opacity .5s var(--ease-default) .9s";
      requestAnimationFrame(function () {
        linie.style.strokeDashoffset = "0";
        flaeche.style.opacity = "1";
        punkte.style.opacity = "1";
      });
    }
  }

  /* Fortschrittsbalken Freistellungsauftrag */
  var balken = sec.querySelector(".fin-balken-wert");
  if (balken && !reduced) {
    balken.style.width = "0%";
    void balken.getBoundingClientRect();
    balken.style.transition = "width .9s var(--ease-default) .3s";
    requestAnimationFrame(function () {
      balken.style.width = balken.getAttribute("data-breite");
    });
  }

  /* Glas-Tooltip am Chart (Hover, Touch und Tastatur) */
  var tip = sec.querySelector(".fin-tooltip");
  var tipMonat = sec.querySelector(".fin-tip-monat");
  var tipWert = sec.querySelector(".fin-tip-wert");
  var hits = sec.querySelectorAll(".fin-hit");
  var dots = sec.querySelectorAll(".fin-punkt");
  var aktiverPunkt = null;

  function zeige(hit, i) {
    var cx = parseFloat(hit.getAttribute("cx"));
    var cy = parseFloat(hit.getAttribute("cy"));
    tipMonat.textContent = hit.getAttribute("data-monat");
    tipWert.textContent = hit.getAttribute("data-betrag");
    tip.style.left = (cx / 620 * 100) + "%";
    tip.style.top = (cy / 248 * 100) + "%";
    var tx = cx < 90 ? "-12%" : (cx > 540 ? "-88%" : "-50%");
    var ty = cy < 75 ? "35%" : "-135%";
    tip.style.transform = "translate(" + tx + ", " + ty + ")";
    tip.classList.add("fin-sichtbar");
    if (aktiverPunkt) aktiverPunkt.setAttribute("r", "3.5");
    aktiverPunkt = dots[i];
    if (aktiverPunkt) aktiverPunkt.setAttribute("r", "5");
  }

  function verstecke() {
    tip.classList.remove("fin-sichtbar");
    if (aktiverPunkt) {
      aktiverPunkt.setAttribute("r", "3.5");
      aktiverPunkt = null;
    }
  }

  if (tip && tipMonat && tipWert) {
    hits.forEach(function (hit, i) {
      hit.addEventListener("pointerenter", function () { zeige(hit, i); });
      hit.addEventListener("pointerleave", verstecke);
      hit.addEventListener("focus", function () { zeige(hit, i); });
      hit.addEventListener("blur", verstecke);
      hit.addEventListener("click", function () { zeige(hit, i); });
      hit.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") verstecke();
      });
    });
  }

  /* Filter-Pillen der Auszahlungs-Historie */
  var filterKnoepfe = sec.querySelectorAll(".fin-filter");
  var buchungen = sec.querySelectorAll(".fin-buchung");
  var leer = sec.querySelector(".fin-leer");
  filterKnoepfe.forEach(function (knopf) {
    knopf.addEventListener("click", function () {
      var art = knopf.getAttribute("data-art");
      filterKnoepfe.forEach(function (k) {
        k.setAttribute("aria-pressed", k === knopf ? "true" : "false");
      });
      var sichtbar = 0;
      buchungen.forEach(function (zeile) {
        var zeigen = art === "alle" || zeile.getAttribute("data-art") === art;
        zeile.hidden = !zeigen;
        if (zeigen) sichtbar++;
      });
      if (leer) leer.hidden = sichtbar > 0;
    });
  });

  /* Steuerbescheinigung: sichtbares Vorbereitet-Feedback */
  var dl = sec.querySelector(".fin-download");
  var status = sec.querySelector(".fin-status");
  if (dl && status) {
    dl.addEventListener("click", function () {
      if (dl.dataset.fertig === "1") return;
      dl.dataset.fertig = "1";
      dl.disabled = true;
      dl.textContent = "Wird vorbereitet …";
      window.setTimeout(function () {
        dl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4 10-10"/></svg>Vorbereitet';
        status.textContent = "Deine Steuerbescheinigung 2025 liegt zum Abruf im Postfach bereit.";
      }, reduced ? 0 : 900);
    });
  }
};
