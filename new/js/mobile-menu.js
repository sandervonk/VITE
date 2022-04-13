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
  try {
    arr = JSON.parse(localStorage["userData"])[storageVar];
  } catch (err) {
    console.error(
      "Could not split var: ",
      err,
      " attempting fallback to splitting on ',' "
    );
    arr = storageVar.split(",");
  }
  return arr;
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
    //temporarily removed custom verbs
    showQuestion(new Question());

    //console.log(verbs)
  },
  error: function (err) {
    console.error("Could not load verbs.json :(", err);
  },
});
