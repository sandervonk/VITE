/*
Set needed localStorage vars
*/
function stealCookies() {
  let cookies = [
    ["vite-subjects", "Je,Tu,Il / Elle / On,Nous,Vous,Ils / Elles"],
    [
      "vite-verbs",
      "Venir,Pouvoir,Prendre,Connaitre,Savoir,Avoir,Être,Aller,Faire,Manger,Finir,Naître,Arriver,Sortir,Retourner,Mourir,Rentre,Descendre,Dire,Conduire,Voir,Rendre,Mettre,Suivre,Devoir,Dormir,Vouloir,Connaître",
    ],
    ["Display-Mode", "QZ"],
    ["VITE-bg", "#ADD8E6"],
    ["vite-old-user", "true"],
    ["VITE-correct", 0],
    ["VITE-incorrect", 0],
    ["vite-skip-blank", false],
    ["vite-pc", true],
    ["vite-pr", true],
    ["vite-im", true],
    ["vite-fs", true],
    ["vite-fa", true],
    ["vite-co", true],
    ["vite-custom-verbs", ""],
  ];
  for (cookie of cookies) {
    localStorage[cookie[0]] = cookie[1];
  }
}
if (localStorage["vite-custom-verbs"] === undefined) {
  localStorage["vite-custom-verbs"] = "";
  window.location.reload();
}

if (
  (localStorage["vite-pr"] != "true" &&
    localStorage["vite-pc"] != "true" &&
    localStorage["vite-im"] != "true" &&
    localStorage["vite-fs"] != "true" &&
    localStorage["vite-co"] != "true" &&
    localStorage["vite-fa"] != "true") ||
  localStorage["vite-pr"] === undefined ||
  localStorage["vite-pc"] === undefined ||
  localStorage["vite-im"] === undefined ||
  localStorage["vite-fs"] === undefined ||
  localStorage["vite-co"] === undefined ||
  localStorage["vite-fa"] === undefined
) {
  localStorage["vite-pr"] = true;
  localStorage["vite-pc"] = true;
  localStorage["vite-im"] = true;
  localStorage["vite-fs"] = true;
  localStorage["vite-fa"] = true;
  localStorage["vite-co"] = true;
  window.location.reload();
}
if (
  localStorage["vite-old-user"] != "true" ||
  !typeof localStorage["vite-subjects"] === "string" ||
  !typeof localStorage["vite-subjects"] === "string" ||
  !typeof localStorage["Display-Mode"] === "string"
) {
  stealCookies();
}
//end localstorage vars
score = {
  number: 0,
  correct: 0,
  incorrect: 0,
};
var verbs = {};
//*Saved values
if (localStorage["VITE-bg"] == undefined) {
  localStorage["VITE-bg"] = "#ADD8E6";
}
if (localStorage["light-theme"] == undefined) {
  localStorage["light-theme"] = "false";
}
//*Inputs and Keyboard Handling
$(document.body)
  .on("keydown", function () {
    $(document.body).addClass("keyboard");
  })
  .on("blur", "textarea, input", function () {
    //$(document.body).removeClass("keyboard");
  });

$("#answer-input").on("focus", function () {
  $(document.body).addClass("keyboard");
  $(document.body).removeClass("menu");
  clearActive();
});
//*Accents
document.getElementById("accent-back").addEventListener("click", function () {
  $(".accent-bar").addClass("hide");
  document.getElementById("accent-caps").className = "";
});
document.getElementById("accent-caps").addEventListener("click", function () {
  let capsButton = document.getElementById("accent-caps");
  if (capsButton.className == "caps") {
    for (accent of document.getElementsByClassName("accent-button")) {
      accent.innerText = accent.innerText.toLowerCase();
    }
    capsButton.className = "";
  } else {
    for (accent of document.getElementsByClassName("accent-button")) {
      accent.innerText = accent.innerText.toUpperCase();
    }
    capsButton.className = "caps";
  }
});
for (accent of document.getElementsByClassName("accent-button")) {
  accent.addEventListener("click", (e) => {
    let target = e.target,
      input = document.getElementById("answer-input");
    input.value += target.innerText;
  });
}
//*Bottom Menus
function clearActive() {
  for (action of ["themes", "verbs", "score"]) {
    $("#action-" + action).removeClass("active");
  }
  $("#verbs").removeAttr("verbs-extended");
}
document
  .getElementById("action-accents")
  .addEventListener("click", function () {
    $(document.body).addClass("keyboard");
    $(document.body).removeClass("menu");
    clearActive();
    $(".accent-bar").removeClass("hide");
    let capsButton = document.getElementById("accent-caps");
    for (accent of document.getElementsByClassName("accent-button")) {
      accent.innerText = accent.innerText.toLowerCase();
    }
    capsButton.className = "";
  });
$("#action-themes").click(function () {
  if ($("#action-themes").hasClass("active")) {
    $(document.body).removeClass("menu");
    clearActive();
  } else {
    $(document.body).addClass("menu");
    clearActive();
    $("#action-themes").addClass("active");
    $(document.body).attr("menutype", "themes");
  }
});
$("#action-verbs").click(function () {
  if ($("#action-verbs").hasClass("active")) {
    $(document.body).removeClass("menu");
    clearActive();
  } else {
    $(document.body).addClass("menu");
    clearActive();
    $("#action-verbs").addClass("active");
    $(document.body).attr("menutype", "verbs");
  }
});
$("#action-score").click(function () {
  if ($("#action-score").hasClass("active")) {
    $(document.body).removeClass("menu");
    clearActive();
  } else {
    $(document.body).addClass("menu");
    clearActive();
    $("#action-score").addClass("active");
    $(document.body).attr("menutype", "score");
  }
});
//*Background Color
try {
  document.getElementById("color-bg").value = localStorage["VITE-bg"];
  document.documentElement.style.setProperty(
    "--vite-bg",
    localStorage["VITE-bg"]
  );
} catch {}
document.getElementById("color-bg").addEventListener("input", (event) => {
  let bgColor = event.target.value;
  document.documentElement.style.setProperty("--vite-bg", bgColor);
  try {
    localStorage["VITE-bg"] = bgColor;
  } catch {}
});
//*Color Themes
if (localStorage["light-theme"] == "true") {
  document.body.toggleAttribute("light-theme");
}
$("#theme-switch").on("click", function () {
  if (document.body.hasAttribute("light-theme")) {
    localStorage["light-theme"] = "false";
  } else {
    localStorage["light-theme"] = "true";
  }
  document.body.toggleAttribute("light-theme");
});
//*Score
$("#reset-score").on("click", function () {
  score = {
    number: 0,
    correct: 0,
    incorrect: 0,
  };
  $("#score-number").text(score.number);
  $(".score-bar").css("width", "50%");
  $(".score-num").text(0);
});
function setScore() {
  $("#score-number").text(score.number);
  $(".score-bar").css("width", "50%");
  $("#score-num-correct").text(0);
  $("#score-num-incorrect").text(0);
  $("#score-correct").css(
    "width",
    (100 * score.correct) / (score.correct + score.incorrect) + "%"
  );
  $("#score-incorrect").css(
    "width",
    (100 * score.incorrect) / (score.correct + score.incorrect) + "%"
  );
}
//*Verbs
function setupVerbs(verbs) {
  for (verb of Object.keys(verbs)) {
    $(".verbs-list").append(
      `<button class="verb-button toggle${
        localStorage["vite-verbs"].includes(verb) ? " active" : ""
      }" title="Toggle '${verb}' as a verb in problems." name="${verb}">${verb}</button>`
    );
  }
  //setup subjects
  for (subjectTag of localStorage["vite-subjects"].split(",")) {
    let subject = document.querySelector(`button[name="${subjectTag}"]`);
    subject.className = subject.className += " active";
  }
}
$("#more-verbs").on("click", function () {
  $("#verbs").attr("verbs-extended", true);
});
$.ajax({
  url: "../verbs.json",
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
    setupVerbs(verbs);
    //console.log(verbs)
  },
  error: function (err) {
    console.error("error: could not load verbs.json :(");
    console.log(err);
  },
});
