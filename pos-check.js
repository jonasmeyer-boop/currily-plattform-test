window.raumInit = window.raumInit || {};
window.raumInit["postfach"] = function (sec) {
  if (sec.dataset.posInit === "1") return;
  sec.dataset.posInit = "1";

  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pill = sec.querySelector(".pos-zaehler");
  var alleBtn = sec.querySelector(".pos-alle-lesen");

  function anzahlUngelesen() {
    return sec.querySelectorAll('.pos-nachricht[data-ungelesen="true"]').length;
  }

  function pillAktualisieren() {
    if (!pill) return;
    var n = anzahlUngelesen();
    if (n > 0) {
      pill.textContent = n + " ungelesen";
      pill.classList.add("pill-violett");
      pill.classList.remove("pill-grau");
    } else {
      pill.textContent = "Alles gelesen";
      pill.classList.remove("pill-violett");
      pill.classList.add("pill-grau");
      if (alleBtn) alleBtn.disabled = true;
    }
    if (!reduziert) {
      pill.classList.remove("pos-puls");
      void pill.offsetWidth;
      pill.classList.add("pos-puls");
    }
  }

  function alsGelesen(nachricht) {
    if (nachricht.dataset.ungelesen !== "true") return;
    nachricht.dataset.ungelesen = "false";
    var hinweis = nachricht.querySelector(".pos-sr");
    if (hinweis) hinweis.textContent = "";
    pillAktualisieren();
  }

  Array.prototype.forEach.call(sec.querySelectorAll(".pos-nachricht"), function (nachricht) {
    var knopf = nachricht.querySelector(".pos-zeile");
    var inhalt = nachricht.querySelector(".pos-inhalt");
    if (!knopf || !inhalt) return;

    inhalt.addEventListener("transitionend", function (e) {
      if (e.propertyName === "max-height" && nachricht.dataset.offen === "true") {
        inhalt.style.maxHeight = "none";
      }
    });

    knopf.addEventListener("click", function () {
      var offen = nachricht.dataset.offen === "true";
      if (offen) {
        nachricht.dataset.offen = "false";
        knopf.setAttribute("aria-expanded", "false");
        inhalt.style.maxHeight = inhalt.scrollHeight + "px";
        void inhalt.offsetHeight;
        inhalt.style.maxHeight = "0px";
      } else {
        nachricht.dataset.offen = "true";
        knopf.setAttribute("aria-expanded", "true");
        inhalt.style.maxHeight = reduziert ? "none" : inhalt.scrollHeight + "px";
        alsGelesen(nachricht);
      }
    });
  });

  if (alleBtn) {
    alleBtn.addEventListener("click", function () {
      Array.prototype.forEach.call(
        sec.querySelectorAll('.pos-nachricht[data-ungelesen="true"]'),
        alsGelesen
      );
    });
  }
};
