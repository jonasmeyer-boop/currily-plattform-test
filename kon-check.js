window.raumInit = window.raumInit || {};
window.raumInit["konto"] = function (sec) {
  if (sec.dataset.konInit === "1") return;
  sec.dataset.konInit = "1";

  var reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function euro(n) { return n.toLocaleString("de-DE") + " €"; }

  function zeigeFeedback(el) {
    if (!el) return;
    el.hidden = false;
    if (reduziert) {
      el.classList.add("kon-an");
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add("kon-an"); });
      });
    }
    clearTimeout(el._konTimer);
    el._konTimer = setTimeout(function () {
      el.classList.remove("kon-an");
      if (reduziert) { el.hidden = true; }
      else { setTimeout(function () { el.hidden = true; }, 300); }
    }, 3000);
  }

  /* Auszahlungskonto: IBAN inline aendern */
  var ibanBtn = sec.querySelector(".kon-iban-btn");
  var ibanForm = sec.querySelector("#kon-iban-form");
  var ibanInput = sec.querySelector("#kon-iban-input");
  var ibanFehler = sec.querySelector("#kon-iban-fehler");
  var ibanWert = sec.querySelector(".kon-iban-wert");
  var ibanFeedback = sec.querySelector(".kon-iban-feedback");

  function ibanFehlerZeigen(zeig) {
    ibanFehler.hidden = !zeig;
    if (zeig) { ibanInput.setAttribute("aria-invalid", "true"); }
    else { ibanInput.removeAttribute("aria-invalid"); }
  }

  function ibanAufklappen(offen) {
    ibanForm.hidden = !offen;
    ibanBtn.setAttribute("aria-expanded", String(offen));
    if (offen) { ibanInput.value = ""; ibanFehlerZeigen(false); ibanInput.focus(); }
  }

  ibanBtn.addEventListener("click", function () { ibanAufklappen(ibanForm.hidden); });
  sec.querySelector(".kon-iban-abbrechen").addEventListener("click", function () {
    ibanAufklappen(false);
    ibanBtn.focus();
  });
  ibanInput.addEventListener("input", function () { ibanFehlerZeigen(false); });
  ibanForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var roh = ibanInput.value.replace(/\s+/g, "").toUpperCase();
    if (roh.length < 15) { ibanFehlerZeigen(true); ibanInput.focus(); return; }
    ibanWert.textContent = roh.slice(0, 4) + " **** **** " + roh.slice(-4);
    ibanAufklappen(false);
    ibanBtn.focus();
    zeigeFeedback(ibanFeedback);
  });

  /* Freistellungsauftrag: Slider inline anpassen */
  var fsaBtn = sec.querySelector(".kon-fsa-btn");
  var fsaForm = sec.querySelector("#kon-fsa-form");
  var fsaSlider = sec.querySelector("#kon-fsa-slider");
  var fsaOut = sec.querySelector(".kon-fsa-out");
  var fsaGenutzt = sec.querySelector(".kon-fsa-genutzt");
  var fsaMax = sec.querySelector(".kon-fsa-max");
  var fsaFeedback = sec.querySelector(".kon-fsa-feedback");
  var fsaGespeichert = 1000;
  var GENUTZT = 801;

  function fsaAufklappen(offen) {
    fsaForm.hidden = !offen;
    fsaBtn.setAttribute("aria-expanded", String(offen));
    if (offen) {
      fsaSlider.value = String(fsaGespeichert);
      fsaOut.textContent = euro(fsaGespeichert);
      fsaSlider.focus();
    }
  }

  fsaBtn.addEventListener("click", function () { fsaAufklappen(fsaForm.hidden); });
  fsaSlider.addEventListener("input", function () { fsaOut.textContent = euro(Number(fsaSlider.value)); });
  sec.querySelector(".kon-fsa-abbrechen").addEventListener("click", function () {
    fsaAufklappen(false);
    fsaBtn.focus();
  });
  sec.querySelector(".kon-fsa-speichern").addEventListener("click", function () {
    fsaGespeichert = Number(fsaSlider.value);
    fsaMax.textContent = euro(fsaGespeichert);
    fsaGenutzt.textContent = euro(Math.min(GENUTZT, fsaGespeichert));
    fsaAufklappen(false);
    fsaBtn.focus();
    zeigeFeedback(fsaFeedback);
  });

  /* Schalter */
  var zweiFaPill = sec.querySelector(".kon-2fa-pill");
  sec.querySelectorAll(".kon-toggle").forEach(function (schalter) {
    schalter.addEventListener("click", function () {
      var an = schalter.getAttribute("aria-pressed") === "true";
      schalter.setAttribute("aria-pressed", String(!an));
      if (schalter.classList.contains("kon-toggle-2fa") && zweiFaPill) {
        if (an) {
          zweiFaPill.className = "pill pill-violett kon-2fa-pill";
          zweiFaPill.textContent = "Empfohlen";
        } else {
          zweiFaPill.className = "pill pill-gruen kon-2fa-pill";
          zweiFaPill.textContent = "Aktiv";
        }
      }
    });
  });

  /* Abmelden */
  var abmeldenFeedback = sec.querySelector(".kon-abmelden-feedback");
  sec.querySelector(".kon-abmelden").addEventListener("click", function () {
    zeigeFeedback(abmeldenFeedback);
  });
};
