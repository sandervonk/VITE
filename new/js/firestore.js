//listen for changes
function initChangeListeners() {
  //console.info("initializing change listeners");
  userDoc().onSnapshot(function (snapshot) {
    if (JSON.stringify(snapshot.data()) != localStorage.getItem("userData")) {
      //console.info("changes detected, reloading prefs");
      try {
        updatedJSON = JSON.parse(localStorage.getItem("userData"));
        clearTimeout(updateTimedFunction);
      } catch (err) {
        console.warn("could not clear timed updates");
      }
      loadCookies();
    }
  });
}

function loadCookies() {
  //load user data from db
  return new Promise(function (fulfilled, rejected) {
    userDoc()
      .get()
      .then((prefJSON) => {
        localStorage.setItem("userData", JSON.stringify(prefJSON.data()));
        //console.info("loaded user prefs to localStorage");
        fulfilled();
      });
  });
}
function stealCookies() {
  //setup user data from template ('custom' has all enabled)
  return new Promise(function (fulfilled, rejected) {
    userDoc()
      .get()
      .then((r) => {
        let path = r.data().path;
        if (path == undefined) {
          path = "custom";
        }
        db.collection("templateUsers")
          .doc(path)
          .get()
          .then((levelJSON) => {
            userDoc()
              .set(levelJSON.data(), { merge: true })
              .then(() => {
                loadCookies().then(() => {
                  new Toast(`Reset to path settings for "` + path + `"`, "default", 1000, "../img/icon/info-icon.svg");
                  fulfilled();
                });
              });
          });
      });
  });
}
function setupTheme(jsonIn) {
  if (jsonIn.theme === "dark") {
    $("#theme-dark-stylesheet, #theme-dark-color").attr("media", "");
    $("#theme-light-color").attr("media", "(prefers-color-scheme: unset) and not(print)");
  } else {
    $("#theme-dark-stylesheet, #theme-dark-color").attr("media", "(prefers-color-scheme: unset) and not(print)");
    $("#theme-light-color").attr("media", "");
  }
}
var today = new Date(),
  updateJSON = {};
var date = [String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0"), today.getFullYear()].join("-");
var dateRef = "xphistory." + date;
function setupGoal(goalNum, goalXp) {
  console.log("goal:", goalNum);
  console.log("xp:", goalXp);
  $("#goal-text").attr({
    value: goalXp,
    goal: goalNum + " xp",
  });
  $("#goal-fill").css({
    width: `${(100 * goalXp) / goalNum}%`,
  });
  console.log(goalXp >= goalNum);
  if (goalXp >= goalNum) {
    $("#mascot-slot").css({
      "background-image": "url(../img/mascot/mood=Excited.svg)",
    });
  }
}
function setupSettings(jsonIn) {
  for (let key of Object.keys(jsonIn)) {
    let switchSel = "[name=" + key + "][value=" + jsonIn[key] + "]";
    $(switchSel).attr("checked", true);
  }
  setupTheme(jsonIn);
}
function setupDailyXP(prevGoal) {
  let updatedJSON = {};
  updateJSON[dateRef] = 0;
  return new Promise(function (fulfilled, rejected) {
    userDoc()
      .update(updateJSON, { merge: true })
      .then(() => {
        setupGoal(prevGoal, 0);
      });
  });
}
function setDefaultSettings() {
  updateJSON = {
    prefs: { theme: "light", pacing: "no", saves: "yes" },
    goal: 30,
    xp: 0,
  };
  updateJSON[dateRef] = 0;
  return new Promise(function (fulfilled, rejected) {
    userDoc()
      .update(updateJSON, { merge: true })
      .then(() => {
        setupSettings({ theme: "light", pacing: "no", saves: "yes" });
        setupGoal(30, 0);
      });
  });
}
function startSettings() {
  userDoc()
    .get()
    .then((r) => {
      console.log(r.data());
      settings = r.data().prefs;
      setupSettings(settings);
      if (settings == undefined || r.data().goal == undefined) {
        setDefaultSettings();
      } else if (r.data().xphistory[date] == undefined) {
        setupDailyXP(r.data().goal);
      } else {
        setupGoal(r.data().goal, r.data().xphistory[date]);
      }
    })
    .catch((err) => {
      console.warn("Setting Default Settings & Goals; Got Error: ", err);
      setDefaultSettings();
    });
}
function startApp() {
  //load verb json with promise
  return new Promise(function (fulfilled, rejected) {
    initChangeListeners();
    $.ajax({
      url: "../verbs.json",
      dataType: "json",
      success: (response) => {
        verbs = response;
        //temporarily removed custom verbs
        loadCookies().then((r) => {
          fulfilled();
        });
      },
      error: function (err) {
        console.error("Could not load verbs.json :(", err);
        rejected(err);
      },
    });
  });
}
function sendUpdate(newData) {
  let filteredJSON = {};
  for (let key of Object.keys(newData)) {
    if (typeof newData[key] != "object" || newData[key].length > 0) {
      filteredJSON[key] = newData[key];
    }
  }
  newJSON = filteredJSON;
  try {
    clearTimeout(updateTimedFunction);
  } catch (err) {}
  updateTimedFunction = setTimeout(function () {
    userDoc().set(filteredJSON, { merge: true });
  }, 2000);
}
