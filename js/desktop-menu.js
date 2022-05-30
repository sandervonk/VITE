if (localStorage["vite-subjects"] == "" || localStorage["vite-verbs"] == "") {
  stealCookies();
  window.location.reload();
}
if (!window.matchMedia("(max-width: 110vh)").matches) {
  $(document.body).addClass("menu");
}

//! New
$("#action-back").click(function () {
  $(document.body).toggleClass("menu");
});

//! From Previousf
//disable autocomplete (& autocomplete bar)
$(document).ready(function () {
  $(document).on("focus", ":input", function () {
    $(this).attr("autocomplete", "off");
  });
});
/*
Set needed localStorage vars
*/
if (window.location.href.includes("http://sander")) {
  window.location.href = window.location.href.replace("http://", "https://");
}
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

//*Score
$("#reset-score").on("click", function () {
  score = {
    number: 0,
    correct: 0,
    incorrect: 0,
    total: 0,
  };
  $("#score-number").text(score.number);
  $(".score-bar").css("width", "50%");
  $(".score-num").text(0);
});
function setScore() {
  $("#score-number").text(score.number);
  $(".score-bar").css("width", "50%");
  $("#score-num-correct").text(score.correct);
  $("#score-num-incorrect").text(score.incorrect);
  $("#score-correct").css("width", (100 * score.correct) / score.total + "%");
  $("#score-incorrect").css("width", (100 * score.incorrect) / score.total + "%");
}
function changeScore(num) {
  if (num == 1) {
    score.correct += 1;
    let duration = (new Date().getTime() - questionStart) / 1000;
    duration -= problemTime["max-perfect"];
    duration = Math.max(0, duration);
    score.number += Math.max(0, parseInt(problemTime["max-score"] * ((problemTime.allotted - duration) / problemTime.allotted)));
  } else {
    score.incorrect += 1;
    score.number -= problemTime["incorrect-deduction"];
    score.number = Math.max(score.number, 0);
  }
  score.total += 1;
  setScore();
}

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
      "Venir,Pouvoir,Prendre,Connaître,Savoir,Avoir,Être,Aller,Faire,Manger,Finir,Vouloir,Dormir,Devoir,Suivre,Voir,Rendre,Mettre,Conduire,Dire,Descendre,Retourner,Mourir,Rentre,Sortir,Arriver,Naître",
    ],
    ["Display-Mode", "QZ"],
    ["VITE-bg", "#414a51"],
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
//end localstorage vars
function sendMessage(head, content, foot) {
  head += "\n\n----- JSON Start -----";
  foot = "----- JSON End -----\n\n" + foot;
  if (content.includes("undefined")) {
    window.alert(
      "looks like something's wrong with your JSON, please try checking the console, and/or make sure you have some custom verbs added below!"
    );
  } else if (content === "{}") {
    window.alert("You don't seem to have any custom verbs, try adding some then trying again!");
  } else {
    let link = `mailto:100026480@mvla.net?subject=My%20Custom%20VITE%20Verbs&body=${encodeURIComponent(head + "\n" + content + "\n" + foot)}`;
    if (link.length >= 2000) {
      window.alert(
        "Sorry, the MAILTO: function only supports messages of up to 2000 characters, so this link will probably not work. Try right-clicking the Share button and copying the JSON on the next page instead!"
      );
      window.open(
        `http://sandervonk.github.io/dev/rawviewer.html?${encodeURIComponent(
          JSON.stringify(JSON.parse("{" + localStorage["vite-custom-verbs"] + "}"), null, "\t")
        )}`,
        "_blank"
      );
    }
    window.location.href = link;
  }
}
var verbs = {};
//*Saved values
if (localStorage["VITE-bg"] == undefined) {
  localStorage["VITE-bg"] = "#414a51";
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
  if (window.matchMedia("(max-width: 110vh)").matches) {
    $(document.body).removeClass("menu");
  }

  clearActive();
});
//*Accents

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
  $("#verbs-menu").removeAttr("verbs-extended");
}

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
  document.documentElement.style.setProperty("--vite-bg", localStorage["VITE-bg"]);
} catch (err) {}
document.getElementById("color-bg").addEventListener("input", (event) => {
  let bgColor = event.target.value;
  document.documentElement.style.setProperty("--vite-bg", bgColor);
  try {
    localStorage["VITE-bg"] = bgColor;
  } catch (err) {}
});
//*Color Themes
if (localStorage["light-theme"] == "true") {
  document.body.toggleAttribute("light-theme");
}
$("#theme-switch").on("click", function () {
  let bgColor = "#ffffff";
  if (document.body.hasAttribute("light-theme")) {
    localStorage["light-theme"] = "false";
    bgColor = "#414a51";
  } else {
    localStorage["light-theme"] = "true";
  }
  document.body.toggleAttribute("light-theme");
  document.documentElement.style.setProperty("--vite-bg", bgColor);
  localStorage["VITE-bg"] = bgColor;
  $("#color-bg").val(bgColor);
});

//*Verbs
function setupVerbs(verbs) {
  for (verb of Object.keys(verbs)) {
    $(".verbs-list").append(
      `<button class="verb-button notranslate toggle${localStorage["vite-verbs"].includes(verb) ? " active" : ""}${
        verbs[verb].custom == true ? " custom-verb" : ""
      }" title="Toggle '${verb}' as a verb in problems." name="${verb}"><span class="verb-name">${verb}</span>${
        verbs[verb].custom == true ? " <img class='custom-verb-img' src='icon/edit.svg' />" : ""
      }</button>`
    );
  }
  //add other click handlers
  $(".subject-button, .tense-button, .verb-button").click(function () {
    //New Question
    showQuestion(new Question());
  });
  //add click handlers
  $(".verb-button").click((e) => {
    if ($(e.target).hasClass("active") && localStorage["vite-verbs"].split(",").length < 2) {
      window.alert("Sorry, you need at least one verb active!");
    } else {
      let array = split(localStorage["vite-verbs"]);
      if ($(e.target).hasClass("active")) {
        let index = array.indexOf(e.target.name);
        if (index > -1) {
          array.splice(index, 1);
        }
      } else {
        array.push(e.target.name);
        //localStorage["vite-verbs"] = array;
      }
      localStorage["vite-verbs"] = array;
      $(`.verb-button[name="${e.target.name}"]`).toggleClass("active");
      while (localStorage["vite-verbs"].includes(",,")) {
        localStorage["vite-verbs"] = localStorage["vite-verbs"].replace(",,", ",");
      }
      while (localStorage["vite-verbs"].substr(localStorage["vite-verbs"].length - 1) == ",") {
        localStorage["vite-verbs"] = localStorage["vite-verbs"].substr(0, localStorage["vite-verbs"].length - 1);
      }
    }
  });
  //setup tenses

  //setup subjects
  for (subjectTag of split(localStorage["vite-subjects"])) {
    $(`button[name="${subjectTag}"]`).addClass("active");
  }
  for (tense of ["pr", "pc", "ps", "im", "fs", "fa", "co"]) {
    if (JSON.parse(localStorage["vite-" + tense])) {
      $("#tense-" + tense).addClass("active");
    }
  }
  $(".tense-button").click((e) => {
    localStorage["vite-" + e.target.id.replace("tense-", "")] = !$(e.target).hasClass("active");
    $(e.target).toggleClass("active");
  });
  $(".subject-button").click((e) => {
    if ($(e.target).hasClass("active") && localStorage["vite-subjects"].split(",").length < 2) {
      window.alert("Sorry, you need at least one subject active!");
    } else {
      let array = split(localStorage["vite-subjects"]);
      if ($(e.target).hasClass("active")) {
        let index = array.indexOf(e.target.name);
        if (index > -1) {
          array.splice(index, 1);
        }
      } else {
        array.push(e.target.name);
      }
      localStorage["vite-subjects"] = array;
      $(e.target).toggleClass("active");
    }
  });
}
$("#more-verbs").on("click", function () {
  $("#verbs-menu").attr("verbs-extended", true);
  document.getElementById("verbs-scroll").scrollTo(0, 0);
});
$("#verbs-back").on("click", function () {
  $("#verbs-menu").attr("verbs-extended", false);
});
$.ajax({
  url: "../verbs.json",
  dataType: "json",
  success: (response) => {
    verbs = response;
    if (localStorage["vite-custom-verbs"] != "") {
      $("#verb-custom-share").addClass("active");
      verbs = JSON.parse(JSON.stringify(verbs).substr(0, JSON.stringify(verbs).length - 1) + ", " + localStorage["vite-custom-verbs"] + "}");
    }
    setupVerbs(verbs);
    setTimeout(function () {
      showQuestion(new Question());
    }, 500);

    //console.log(verbs)
  },
  error: function (err) {
    console.error("error: could not load verbs.json :(");
    console.log(err);
  },
});
$("#verb-add-reset").on("click", function () {
  localStorage["vite-custom-verbs"] = "";
  localStorage["vite-verbs"] =
    "Venir,Pouvoir,Prendre,Connaître,Savoir,Avoir,Être,Aller,Faire,Manger,Finir,Vouloir,Dormir,Devoir,Suivre,Voir,Rendre,Mettre,Conduire,Dire,Descendre,Retourner,Mourir,Rentre,Sortir,Arriver,Naître";
  window.location.reload();
});
$("#verb-add-submit").click(function () {
  let finished = true;
  for (inputElement of document.querySelectorAll("#verb-add input, #verb-add select")) {
    $(inputElement).removeClass("attention");
    if (inputElement.value === "") {
      finished = false;
      $(inputElement).addClass("attention");
    }
  }
  if (!finished) {
    window.alert("Looks like some fields still need to be filled out. Try doing so and submitting it again!");
  } else {
    let newVerb = {
      defintion: $("#verb-add-def").val(),
      FS: $("#verb-add-stem").val(),
      PC: {
        helping: $("#verb-add-helping").val(),
        participle: $("#verb-add-participle").val(),
      },
      custom: true,
      Je: $("#verb-add-subject-1").val(),
      Tu: $("#verb-add-subject-2").val(),
      "Il / Elle / On": $("#verb-add-subject-3").val(),
      Nous: $("#verb-add-subject-4").val(),
      Vous: $("#verb-add-subject-5").val(),
      "Ils / Elles": $("#verb-add-subject-6").val(),
    };
    newVerb = JSON.stringify(newVerb);
    newVerb = `"` + document.getElementById("verb-add-name").value + `"` + ": " + newVerb;
    localStorage["vite-custom-verbs"] += (localStorage["vite-custom-verbs"].length > 0 ? "," : "") + newVerb;
    setupVerbs(JSON.parse("{" + newVerb + "}"));
    $("#verb-add input").val("");
    $("#verb-add select").val("Avoir");
  }
});
$("#verb-custom-share").click(function () {
  sendMessage("Check out my custom VITE! verbs:", JSON.stringify(JSON.parse("{" + localStorage["vite-custom-verbs"] + "}"), null, "\t"), "Best,\nMe");
});
$("#verb-custom-share").on("contextmenu", function () {
  window.open(
    `http://sandervonk.github.io/dev/rawviewer.html?${encodeURIComponent(
      JSON.stringify(JSON.parse("{" + localStorage["vite-custom-verbs"] + "}"), null, "\t")
    )}`,
    "_blank"
  );
});
$("#answer-input").on("input", function () {
  if ($("#answer-input").val().toLowerCase().includes("rick"))
    $("#rick").html(
      `<iframe width='100%' height='100%' src='https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&loop=1&amp;autoplay=1' title='Rick Says Hi :)' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen=''></iframe>`
    );
});
$(document).on("keydown", function (e) {
  if (e.key == "Escape") {
    $("#rick").html("");
  }
});
