try {
  $(params.get("hide")).hide();
} catch {}
if (params.has("resolveto")) {
  $("#close-button").click(function () {
    e.preventDefault();
    window.open(params.get("resolveto"), "_self");
  });
}
var verbs,
  tenses = {
    pr: "Présent",
    pc: "Passé Composé",
    im: "Imparfait",
    co: "Conditionnel",
    ps: "Passé Simple",
    fs: "Futur Simple",
    fa: "Futur Antérieur",
    cp: "Conditionnel Passé",
    su: "Subjonctif",
    sp: "Subjonctif Passé",
  },
  subjectDefinitions = {
    Je: "I",
    Tu: "You",
    "Il / Elle / On": "He / She / One",
    Nous: "We",
    Vous: "You",
    "Ils / Elles": "They (m) / They (f) ",
  },
  tenseDefinitions = {
    pr: "Présent tense",
    pc: "Past tense",
    ps: "Past tense (literature)",
    im: "Past state or ongoing action",
    fs: "Future tense (intentions, predictions, conditional)",
    fa: "Future tense (actions previous to another)",
    co: "Conditional tense",
    cp: "Past conditional tense (regrets, what would / could have happened)",
    su: "Subjunctive Tense (opinions, emotions, and possibilities)",
    sp: "Past of the Subjunctive Tense (opinions, emotions, and possibilities)",
  },
  updatedJSON = {};

function setupSetup() {
  $(".options-toggles > .option-toggle").remove();
  for (let subject of [
    "Je",
    "Tu",
    "Il / Elle / On",
    "Nous",
    "Vous",
    "Ils / Elles",
  ]) {
    $("#subject-toggles").append(
      `<button type="button" title="${
        subjectDefinitions[subject]
      }" class="option-toggle subject-toggle ${
        JSON.parse(localStorage["userData"]).subjects.includes(subject)
          ? "active"
          : ""
      } box">${subject}</button>`
    );
  }
  for (let verb of Object.keys(verbs)) {
    $("#verb-toggles").append(
      `<button type="button" title="${
        verbs[verb].definition
      }" class="option-toggle verb-toggle ${
        JSON.parse(localStorage["userData"]).verbs.includes(verb)
          ? "active"
          : ""
      } box">${verb}</button>`
    );
  }
  for (let tense of Object.keys(tenses)) {
    $("#tense-toggles").append(
      `<button id="${tense}" type="button" title="${
        tenseDefinitions[tense]
      }" class="option-toggle tense-toggle ${
        JSON.parse(localStorage["userData"]).tenses.includes(tense)
          ? "active"
          : ""
      } box">${tenses[tense]}</button>`
    );
  }
}

var newJSON = JSON.parse(localStorage.getItem("userData")),
  updateTimedFunction;
$(document.body).on("click", ".option-toggle.verb-toggle", (e) => {
  updatedJSON.verbs = [];
  if (
    $(".option-toggle.verb-toggle.active").length >= 2 ||
    !$(e.target).hasClass("active")
  ) {
    $(e.target).toggleClass("active");
    $(".option-toggle.verb-toggle.active").each((i, el) => {
      updatedJSON.verbs.push($(el).text());
    });
    if (updatedJSON.verbs.length >= 1) {
      sendUpdate(updatedJSON);
    }
  } else {
    alert("You must have at least one verb enabled!");
  }
});

$(document.body).on("click", ".option-toggle.subject-toggle", (e) => {
  updatedJSON.subjects = [];
  if (
    $(".option-toggle.subject-toggle.active").length >= 2 ||
    !$(e.target).hasClass("active")
  ) {
    $(e.target).toggleClass("active");
    $(".option-toggle.subject-toggle.active").each((i, el) => {
      updatedJSON.subjects.push($(el).text());
    });
    if (updatedJSON.subjects.length >= 1) {
      sendUpdate(updatedJSON);
    }
  } else {
    alert("You must have at least one subject enabled!");
  }
});
$(document.body).on("click", ".option-toggle.tense-toggle", (e) => {
  updatedJSON.tenses = [];
  if (
    $(".option-toggle.tense-toggle.active").length >= 2 ||
    !$(e.target).hasClass("active")
  ) {
    $(e.target).toggleClass("active");
    $(".option-toggle.tense-toggle.active").each((i, el) => {
      updatedJSON.tenses.push(el.id);
    });
    if (updatedJSON.tenses.length >= 1) {
      sendUpdate(updatedJSON);
    }
  } else {
    alert("You must have at least one tense enabled!");
  }
});
$("form").on("submit", (e) => {
  e.preventDefault();
  $("form").off();
  try {
    clearTimeout(updateTimedFunction);
  } catch {
    console.warn("could not clear previous update");
  }
  db.collection("users")
    .doc(auth.getUid())
    .set(newJSON, { merge: true })
    .then(() => {
      if (params.has("resolveto")) {
        window.open(params.get("resolveto"), "_self");
      } else {
        $("form").submit();
      }
    });
});
$("#reset-button").on("click", (e) => {
  stealCookies().then(() => {
    setupSetup();
  });
});
