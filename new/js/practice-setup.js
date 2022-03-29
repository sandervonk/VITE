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
function setupVerbs() {
  for (let verb of Object.keys(verbs)) {
    $("#verb-toggles").append(
      `<button type="button" class="option-toggle verb-toggle ${
        localStorage["vite-verbs"].split(",").includes(verb) ? "active" : ""
      } box">${verb}</button>`
    );
  }
  for (let tense of Object.keys(tenses)) {
    $("#tense-toggles").append(
      `<button id="${tense}" type="button" class="option-toggle tense-toggle ${
        JSON.parse(localStorage["vite-" + tense]) ? "active" : ""
      } box">${tenses[tense]}</button>`
    );
  }
}

$.ajax({
  url: "../../verbs.json",
  dataType: "json",
  success: (response) => {
    verbs = response;
    if (localStorage["vite-custom-verbs"] != "") {
      verbs = JSON.parse(
        JSON.stringify(verbs).substr(0, JSON.stringify(verbs).length - 1) +
          ", " +
          localStorage["vite-custom-verbs"] +
          "}"
      );
    }

    setupVerbs();
    //console.log(verbs)
  },
  error: function (err) {
    console.error("error: could not load verbs.json :(");
    console.log(err);
  },
});
$(document.body).on("click", ".option-toggle.verb-toggle", (e) => {
  let enabledVerbs = [];
  if (
    $(".option-toggle.verb-toggle.active").length >= 2 ||
    !$(e.target).hasClass("active")
  ) {
    $(e.target).toggleClass("active");

    $(".option-toggle.verb-toggle.active").each((i, el) => {
      enabledVerbs.push($(el).text());
    });
    localStorage["vite-verbs"] = enabledVerbs.join(",");
  } else {
    alert("You must have at least one verb enabled!");
  }
});
$(document.body).on("click", ".option-toggle.tense-toggle", (e) => {
  if (
    $(".option-toggle.tense-toggle.active").length >= 2 ||
    !$(e.target).hasClass("active")
  ) {
    $(e.target).toggleClass("active");
    localStorage["vite-" + e.target.id] = $(e.target).hasClass("active");
  } else {
    alert("You must have at least one tense enabled!");
  }
});
