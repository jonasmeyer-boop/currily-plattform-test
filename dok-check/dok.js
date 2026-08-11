window.raumInit = window.raumInit || {};
window.raumInit["dokumente"] = function (sec) {
  if (sec.dataset.dokInit) return;
  sec.dataset.dokInit = "1";

  var suchfeld = sec.querySelector(".dok-suchfeld");
  var katKnoepfe = Array.prototype.slice.call(sec.querySelectorAll(".dok-kat"));
  var zeilen = Array.prototype.slice.call(sec.querySelectorAll(".dok-doc"));
  var leer = sec.querySelector(".dok-leer");
  var leerSuche = sec.querySelector(".dok-leer-suche");
  var leerFilter = sec.querySelector(".dok-leer-filter");
  var begriff = sec.querySelector(".dok-leer-begriff");
  var anzahl = sec.querySelector(".dok-anzahl");
  var gesamt = zeilen.length;
  var aktiveKat = "alle";

  zeilen.forEach(function (z) {
    z.dataset.suchtext = z.querySelector(".dok-titel").textContent.toLowerCase();
  });

  function filtern() {
    var q = suchfeld.value.trim().toLowerCase();
    var treffer = 0;
    zeilen.forEach(function (z) {
      var passt =
        (aktiveKat === "alle" || z.dataset.kategorie === aktiveKat) &&
        (!q || z.dataset.suchtext.indexOf(q) !== -1);
      z.hidden = !passt;
      if (passt) treffer++;
    });
    var nichts = treffer === 0;
    leer.hidden = !nichts;
    if (nichts) {
      leerSuche.hidden = !q;
      leerFilter.hidden = !!q;
      if (q) begriff.textContent = "„" + suchfeld.value.trim() + "“";
    }
    if (treffer === gesamt) {
      anzahl.textContent = gesamt + " Dokumente · 10,5 MB";
    } else {
      anzahl.textContent = treffer + " von " + gesamt + " Dokumenten";
    }
  }

  suchfeld.addEventListener("input", filtern);

  katKnoepfe.forEach(function (k) {
    k.addEventListener("click", function () {
      aktiveKat = k.dataset.kat;
      katKnoepfe.forEach(function (b) {
        b.setAttribute("aria-pressed", b === k ? "true" : "false");
      });
      filtern();
    });
  });

  sec.querySelector(".dok-reset").addEventListener("click", function () {
    suchfeld.value = "";
    aktiveKat = "alle";
    katKnoepfe.forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.kat === "alle" ? "true" : "false");
    });
    filtern();
    suchfeld.focus();
  });

  function feedback(btn, dauer) {
    if (btn.dataset.aktiv) return;
    var normal = btn.querySelector(".dok-fb-normal");
    var ok = btn.querySelector(".dok-fb-ok");
    btn.dataset.aktiv = "1";
    normal.hidden = true;
    ok.hidden = false;
    window.setTimeout(function () {
      normal.hidden = false;
      ok.hidden = true;
      delete btn.dataset.aktiv;
    }, dauer);
  }

  zeilen.forEach(function (z) {
    var btn = z.querySelector(".dok-download");
    btn.addEventListener("click", function () {
      feedback(btn, 1500);
    });
  });

  sec.querySelector(".dok-zip").addEventListener("click", function () {
    feedback(sec.querySelector(".dok-zip"), 2000);
  });

  filtern();
};
