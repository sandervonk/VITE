var scoringData = {
  target: new URLSearchParams(window.location.search).get("numquestions"),
  countAll: new URLSearchParams(window.location.search).get("count"),
  startTime: new Date().getTime(),
  doSetup: new URLSearchParams(window.location.search).get("type") == "create",
};
if (scoringData.doSetup == true) {
  window.open("./practice-setup.html", "_self");
}
if (
  parseInt(scoringData.target) == NaN ||
  scoringData.countAll == null ||
  scoringData.target == Infinity
) {
  $("header").addClass("infinite");
  $("#progress-fill").css("width", "100%");
}
history.replaceState({}, "", "practice.html");
function setScore() {
  console.log("implement score show here");
  let elapsedTime = new Date().getTime() - scoringData.startTime;
  $("#results-duration").val(elapsedTime);
  $("#results-total").val(score.total);
  $("#results-correct").val(score.correct);
  if (parseInt(scoringData.target) != NaN && scoringData.countAll != null) {
    $("#progress-fill").css(
      "width",
      ((scoringData.countAll == "all" ? score.total : score.correct) /
        parseInt(scoringData.target)) *
        100 +
        "%"
    );
  }
}
if (
  localStorage["vite-subjects"] == undefined ||
  localStorage["vite-verbs"] == undefined ||
  localStorage["vite-subjects"].length == 0 ||
  localStorage["vite-verbs"].length == 0
) {
  stealCookies();
  window.location.reload();
}
//disable autocomplete (& autocomplete bar)
$(document).ready(function () {
  $(document).on("focus", ":input", function () {
    $(this).attr("autocomplete", "off");
  });
});
/*
  Set needed localStorage vars
  */
var score = {
    number: 0,
    correct: 0,
    incorrect: 0,
    total: 0,
  },
  problemTime = {
    "max-perfect": 2,
    allotted: 18,
    "max-score": 1000,
    score: 0,
    problems: 0,
    "incorrect-deduction": 100,
  };
function split(storageVar) {
  let arr = [];
  for (let item of storageVar.split(",")) {
    if (item != "") {
      arr.push(item);
    }
  }
  return arr;
}
function stealCookies() {
  let cookies = [
    ["vite-subjects", "Je,Tu,Il / Elle / On,Nous,Vous,Ils / Elles"],
    [
      "vite-verbs",
      "Venir,Pouvoir,Prendre,Connaître,Savoir,Avoir,Être,Aller,Faire,Manger,Finir,Vouloir,Dormir,Rester,Devoir,Suivre,Voir,Rendre,Pleurer,Sauter,Mettre,Conduire,Dire,Penser,Descendre,Retourner,Mourir,Rentre,Sortir,Arriver,Naître",
    ],
    ["Display-Mode", "QZ"],
    ["VITE-bg", "#ADD8E6"],
    ["vite-old-user", "true"],
    ["VITE-correct", 0],
    ["VITE-incorrect", 0],
    ["vite-skip-blank", false],
    ["vite-pc", true],
    ["vite-ps", true],
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
    localStorage["vite-ps"] != "true" &&
    localStorage["vite-im"] != "true" &&
    localStorage["vite-fs"] != "true" &&
    localStorage["vite-co"] != "true" &&
    localStorage["vite-fa"] != "true") ||
  localStorage["vite-pr"] === undefined ||
  localStorage["vite-pc"] === undefined ||
  localStorage["vite-ps"] === undefined ||
  localStorage["vite-im"] === undefined ||
  localStorage["vite-fs"] === undefined ||
  localStorage["vite-co"] === undefined ||
  localStorage["vite-fa"] === undefined
) {
  localStorage["vite-pr"] = true;
  localStorage["vite-pc"] = true;
  localStorage["vite-ps"] = true;
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
var verbs = {};
function changeScore(num) {
  if (num == 1) {
    score.correct += 1;
    let duration = (new Date().getTime() - questionStart) / 1000;
    duration -= problemTime["max-perfect"];
    duration = Math.max(0, duration);
    score.number += Math.max(
      0,
      parseInt(
        problemTime["max-score"] *
          ((problemTime.allotted - duration) / problemTime.allotted)
      )
    );
  } else {
    score.incorrect += 1;
    score.number -= problemTime["incorrect-deduction"];
    score.number = Math.max(score.number, 0);
  }
  score.total += 1;
  setScore();
}

$.ajax({
  url: "../verbs.json",
  dataType: "json",
  success: (response) => {
    verbs = response;
    if (localStorage["vite-custom-verbs"] != "") {
      $("#verb-custom-share").addClass("active");
      verbs = JSON.parse(
        JSON.stringify(verbs).substr(0, JSON.stringify(verbs).length - 1) +
          ", " +
          localStorage["vite-custom-verbs"] +
          "}"
      );
    }
    showQuestion(new Question());

    //console.log(verbs)
  },
  error: function (err) {
    console.error("error: could not load verbs.json :(");
    console.log(err);
  },
});
