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
try {
  window.addEventListener("load", function () {
    //setup accents
    for (accentButton of document.getElementsByClassName("accent-shortcut")) {
      accentButton.addEventListener("click", (e) => {
        let target = e.target;
        while (target.className != "accent-shortcut") {
          target = target.children[0];
        }
        document.getElementById("question-answer-input").value += target.innerText;
      });
    }
    //capslock
    document.getElementById("accent-caps").addEventListener("click", (e) => {
      let capsButton = document.getElementById("accent-caps");
      for (accentButton of document.getElementsByClassName("accent-shortcut")) {
        if (capsButton.className == "active") {
          accentButton.innerText = accentButton.innerText.toLowerCase();
        } else {
          accentButton.innerText = accentButton.innerText.toUpperCase();
        }
      }
      if (capsButton.className == "active") {
        capsButton.className = "";
      } else {
        capsButton.className = "active";
      }
    });
    //setup tense
    if (JSON.parse(localStorage["vite-pc"])) {
      document.getElementById("tense-pc").className += " active";
    }
    if (JSON.parse(localStorage["vite-pr"])) {
      document.getElementById("tense-pr").className += " active";
    }
    if (JSON.parse(localStorage["vite-im"])) {
      document.getElementById("tense-im").className += " active";
    }
    if (JSON.parse(localStorage["vite-fs"])) {
      document.getElementById("tense-fs").className += " active";
    }
    if (JSON.parse(localStorage["vite-fa"])) {
      document.getElementById("tense-fa").className += " active";
    }
    if (JSON.parse(localStorage["vite-co"])) {
      document.getElementById("tense-co").className += " active";
    }
    document.getElementById("score-label").addEventListener("click", function () {
      window.alert(
        [
          "change the following in the console to adjust the grade timing:",
          `problemTime["max-perfect"]\nto change the max time in seconds for a perfect score`,
          `problemTime.allotted\nto change the max time in seconds for a score > 0`,
          `problemTime["max-score"]\nto change the max score that can be received for a problem`,
          `problemTime["incorrect-deduction"]\nto change amount of points deducted for an incorrect answer`,
        ].join(`\n\n`)
      );
    });
    //tense toggles
    document.getElementById("tense-pc").addEventListener("click", function () {
      if (!JSON.parse(localStorage["vite-pc"])) {
        localStorage["vite-pc"] = true;
        document.getElementById("tense-pc").className = "select-button active";
      } else if (
        (JSON.parse(localStorage["vite-im"]) ||
          JSON.parse(localStorage["vite-fs"]) ||
          JSON.parse(localStorage["vite-fa"]) ||
          JSON.parse(localStorage["vite-pr"])) &&
        JSON.parse(localStorage["vite-pc"])
      ) {
        localStorage["vite-pc"] = false;
        document.getElementById("tense-pc").className = "select-button";
      } else {
        window.alert("sorry, at least one tense needs to be selected!");
      }
    });
    document.getElementById("tense-pr").addEventListener("click", function () {
      if (!JSON.parse(localStorage["vite-pr"])) {
        localStorage["vite-pr"] = true;
        document.getElementById("tense-pr").className = "select-button active";
      } else if (
        (JSON.parse(localStorage["vite-im"]) ||
          JSON.parse(localStorage["vite-pc"]) ||
          JSON.parse(localStorage["vite-fa"]) ||
          JSON.parse(localStorage["vite-co"]) ||
          JSON.parse(localStorage["vite-fs"])) &&
        JSON.parse(localStorage["vite-pr"])
      ) {
        localStorage["vite-pr"] = false;
        document.getElementById("tense-pr").className = "select-button";
      } else {
        window.alert("sorry, at least one tense needs to be selected!");
      }
    });
    document.getElementById("tense-im").addEventListener("click", function () {
      if (!JSON.parse(localStorage["vite-im"])) {
        localStorage["vite-im"] = true;
        document.getElementById("tense-im").className = "select-button active";
      } else if (
        (JSON.parse(localStorage["vite-fs"]) ||
          JSON.parse(localStorage["vite-pc"]) ||
          JSON.parse(localStorage["vite-co"]) ||
          JSON.parse(localStorage["vite-fa"]) ||
          JSON.parse(localStorage["vite-pr"])) &&
        JSON.parse(localStorage["vite-im"])
      ) {
        localStorage["vite-im"] = false;
        document.getElementById("tense-im").className = "select-button";
      } else {
        window.alert("sorry, at least one tense needs to be selected!");
      }
    });
    document.getElementById("tense-fs").addEventListener("click", function () {
      if (!JSON.parse(localStorage["vite-fs"])) {
        localStorage["vite-fs"] = true;
        document.getElementById("tense-fs").className = "select-button active";
      } else if (
        (JSON.parse(localStorage["vite-im"]) ||
          JSON.parse(localStorage["vite-pc"]) ||
          JSON.parse(localStorage["vite-co"]) ||
          JSON.parse(localStorage["vite-fa"]) ||
          JSON.parse(localStorage["vite-pr"])) &&
        JSON.parse(localStorage["vite-fs"])
      ) {
        localStorage["vite-fs"] = false;
        document.getElementById("tense-fs").className = "select-button";
      } else {
        window.alert("sorry, at least one tense needs to be selected!");
      }
    });
    document.getElementById("tense-fa").addEventListener("click", function () {
      if (!JSON.parse(localStorage["vite-fa"])) {
        localStorage["vite-fa"] = true;
        document.getElementById("tense-fa").className = "select-button active";
      } else if (
        (JSON.parse(localStorage["vite-im"]) ||
          JSON.parse(localStorage["vite-pc"]) ||
          JSON.parse(localStorage["vite-co"]) ||
          JSON.parse(localStorage["vite-fs"]) ||
          JSON.parse(localStorage["vite-pr"])) &&
        JSON.parse(localStorage["vite-fa"])
      ) {
        localStorage["vite-fa"] = false;
        document.getElementById("tense-fa").className = "select-button";
      } else {
        window.alert("sorry, at least one tense needs to be selected!");
      }
    });
    document.getElementById("tense-co").addEventListener("click", function () {
      if (!JSON.parse(localStorage["vite-co"])) {
        localStorage["vite-co"] = true;
        document.getElementById("tense-co").className = "select-button active";
      } else if (
        (JSON.parse(localStorage["vite-im"]) ||
          JSON.parse(localStorage["vite-pc"]) ||
          JSON.parse(localStorage["vite-fs"]) ||
          JSON.parse(localStorage["vite-fa"]) ||
          JSON.parse(localStorage["vite-pr"])) &&
        JSON.parse(localStorage["vite-co"])
      ) {
        localStorage["vite-co"] = false;
        document.getElementById("tense-co").className = "select-button";
      } else {
        window.alert("sorry, at least one tense needs to be selected!");
      }
    });
    //setup stats and more
    document.getElementById("stats-correct").style.width = `${
      (100 * parseInt(localStorage["VITE-correct"])) / (parseInt(localStorage["VITE-correct"]) + parseInt(localStorage["VITE-incorrect"]))
    }%`;
    document.getElementById("stats-correct").title = `${parseInt(localStorage["VITE-correct"])} Correct`;
    document.getElementById("stats-parent").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`;
    document.getElementById("stats-correct-label").title = `${parseInt(localStorage["VITE-correct"])} Correct`;
    document.getElementById("stats-incorrect-label").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`;
    let qMode = localStorage["Display-Mode"];
    let tense = localStorage["vite-pc"];
    if (qMode === "MD" || qMode === "QZ" || qMode === "WS") {
      document.getElementById("mode-" + qMode).className += " active";
    } else {
      localStorage["Display-Mode"] = "QZ";
      document.getElementById("mode-QZ").className += " active";
      qMode = "QZ";
    }
    document.body.className = qMode;

    for (qModeSelect of document.querySelectorAll("#display-modes button")) {
      qModeSelect.addEventListener("click", (event) => {
        let typeID = event.target.id.replace("mode-", "");
        localStorage["Display-Mode"] = typeID;
        for (altOption of document.querySelectorAll("#display-modes button")) {
          altOption.className = altOption.className.replace(" active", "");
        }

        document.getElementById("mode-" + typeID).className += " active";
        document.body.className = typeID;
      });
    }
    //setup background color handlers
    try {
      document.documentElement.style.setProperty("--vite-bg", localStorage["VITE-bg"]);
      document.getElementById("color-bg").value = localStorage["VITE-bg"];
    } catch (err) {}
    document.getElementById("color-bg").addEventListener("input", (event) => {
      let bgColor = event.target.value;
      document.body.style.background = bgColor;
      try {
        localStorage["VITE-bg"] = bgColor;
      } catch (err) {}
    });

    for (subjectToggle of document.querySelectorAll("#table-subjects button")) {
      subjectToggle.addEventListener("click", (event) => {
        let element = event.target;
        if (element.className.includes(" active")) {
          element.className = element.className.replace(" active", "");
        } else {
          element.className += " active";
        }
      });
    }
  });
} catch (err) {
  stealCookies();
  window.alert("errored, check console log", err);
  console.error(err);
}
