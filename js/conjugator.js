"use strict";
function setupVerbDropdown(verbsJSON) {
  return new Promise((resolved, rejected) => {
    try {
      for (let verb of Object.keys(verbsJSON)) {
        $("#conjugator-verb").append(`<option value="${verb}">${verb}</option>`);
      }
      resolved();
    } catch (err) {
      rejected(err);
    }
  });
}
function fillConjugations() {
  let conjugation_verb = $("#conjugator-verb").val(),
    conjugation_tense = $("#conjugator-tense").val();
  if (conjugation_tense && conjugation_verb) {
    $("#bottom-actions > div").removeClass("disabled");
    $(".conjugate-verb").each(function (i, el) {
      el = $(el);
      let options = { tense: conjugation_tense, verb: conjugation_verb, subject: el.attr("subject") };
      let conjugation = new Question(options);
      el.text(conjugation.answer.alt);
    });
  }
}
$("#search-options").on("change", fillConjugations);

function setupApp() {
  return new Promise((resolved, rejected) => {
    setupVerbDropdown(verbs)
      .then(() => {
        if (params && params.get("verb") && $("#conjugator-verb").has(`option[value="${params.get("verb")}"]`)) {
          $("#conjugator-verb").val(params.get("verb"));
        }
        if (params && params.get("tense") && $("#conjugator-tense").has(`option[value="${params.get("tense")}"]`)) {
          $("#conjugator-tense").val(params.get("tense"));
        }
        fillConjugations();
        function changeVerb(change) {
          let verbNames = Object.keys(verbs);

          return function () {
            let nextIndex = verbNames.indexOf($("#conjugator-verb").val()) + change;
            if (nextIndex < 0) {
              nextIndex = verbNames.length - 1;
            } else if (nextIndex > verbNames.length - 1) {
              nextIndex = 0;
            }
            $("#conjugator-verb").val(verbNames[nextIndex]);
            fillConjugations();
          };
        }

        $("#prev-button").click(changeVerb(-1));
        $("#next-button").click(changeVerb(1));

        resolved();
      })
      .catch((err) => {
        rejected(err);
      });
  });
}
$("#explanation-button").click(() => {
  let newStorage;
  try {
    newStorage = JSON.parse(localStorage.getItem("userData"));
  } catch (err) {
    newStorage = {};
  }
  newStorage.verbs = [$("#conjugator-verb").val()];
  newStorage.tense = [$("#conjugator-tense").val()];
  newStorage.subjects = ["Je", "Tu", "Il / Elle / On", "Nous", "Vous", "Ils / Elles"];
  localStorage.setItem("userData", JSON.stringify(newStorage));
  new Toast("Creating a worksheet!", "default", 1000, "/VITE/img/icon/info-icon.svg", "./sheetify.html?right=true&template=VITE!%20Classic&tense=" + $("#conjugator-tense").val());
});

$("#wordreference-button").click(() => {
  window.open(`//www.wordreference.com/conj/frverbs.aspx?v=${encodeURIComponent($("#conjugator-verb").val())}`, "_newtab");
});
