var verbs,
  tenses = {
    pr: "Présent",
    pc: "Passé Composé",
    ps: "Passé Simple",
    im: "Imparfait",
    fs: "Futur Simple",
    fa: "Futur Antérieur",
    co: "Conditionnel",
  };
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
      `<button type="button" class="option-toggle subject-toggle ${
        JSON.parse(localStorage["userData"]).subjects.includes(subject)
          ? "active"
          : ""
      } box">${subject}</button>`
    );
  }
  for (let verb of Object.keys(verbs)) {
    $("#verb-toggles").append(
      `<button type="button" class="option-toggle verb-toggle ${
        JSON.parse(localStorage["userData"]).verbs.includes(verb)
          ? "active"
          : ""
      } box">${verb}</button>`
    );
  }
  for (let tense of Object.keys(tenses)) {
    $("#tense-toggles").append(
      `<button id="${tense}" type="button" class="option-toggle tense-toggle ${
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
  db.collection("users").doc(auth.getUid()).set(newJSON, { merge: true });
});
$("#reset-button").on("click", (e) => {
  stealCookies().then(() => {
    setupSetup();
  });
});