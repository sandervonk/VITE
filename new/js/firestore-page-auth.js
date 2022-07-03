/** FIRESTORE **/

//listen for changes
function initChangeListeners() {
  userDoc().onSnapshot(function (snapshot) {
    if (JSON.stringify(snapshot.data()) != localStorage.getItem("userData")) {
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
  $("#goal-text").attr({
    value: goalXp,
    goal: goalNum + " xp",
  });
  $("#goal-fill").css({
    width: `${(100 * goalXp) / goalNum}%`,
  });
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

/** PAGE AUTH **/
try {
  var messagechannelBroadcast = new BroadcastChannel("messagechannel");
} catch (err) {
  console.warn("could not setup BroadcastChannel");
}
//img
function setPhoto(url) {
  if (url != null) {
    $(".auth-picture").attr("src", url);
  }
}
//!setup
const config = {
  apiKey: "AIzaSyCZelR1HSbmcPf70rTI5Ig02yasL8RSdPw",
  authDomain: "vite-practice.firebaseapp.com",
  projectId: "vite-practice",
  storageBucket: "vite-practice.appspot.com",
  messagingSenderId: "559659689480",
  appId: "1:559659689480:web:417819295e1ad204e193bd",
  measurementId: "G-61KY0KX892",
};

// Initialize Firebase
firebase.initializeApp(config);
// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
//const messaging = firebase.messaging();
// update firestore settings
db.settings({ timestampsInSnapshots: true, merge: true });
var userDoc = function () {
  return db.collection("users").doc(auth.getUid());
};
//!code
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user logged in");

    setPhoto(user.photoURL);
    if (auth.currentUser.isAnonymous) {
      setPhoto("../img/icon/guest.png");
    }
    let authData = auth.currentUser.metadata;
    userDoc()
      .get()
      .then((doc) => {
        let data = doc.data();
        if ([data.tenses, data.subjects, data.verbs, data.path].includes(undefined) && !window.location.href.includes("onboarding")) {
          new Toast(
            "Some account data is missing, opening onboarding",
            "default",
            1000,
            "https://sander.vonk.one/VITE/new/img/icon/error-icon.svg",
            "https://sander.vonk.one/VITE/new/onboarding.html?showTutorial=false"
          );
        }
        localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("userId", auth.getUid());
      });
    if (!auth.currentUser.emailVerified && !auth.currentUser.isAnonymous && !auth.currentUser.email == null) {
      new Toast(
        "Please verify your email to use the app!",
        "default",
        3000,
        "../img/icon/info-icon.svg",
        $("meta[name=noauthenforce]").prop("content") ? "" : "../"
      );
    } else {
      if (auth.currentUser.isAnonymous) {
        if ($("meta[name=guestprompt]").prop("content")) {
          new Toast("Logged in as guest, your progress will not be saved!", "transparent", 1500, "../img/icon/info-icon.svg");
        } else {
          console.warn("Signed in as guest");
        }
      }
      /*
      new Toast(
        "Logged in successfully!",
        "default",
        500,
        "../img/icon/info-icon.svg"
      );
      */ try {
        startApp().then((r) => {
          if ($("meta[name=runapp]").prop("content")) {
            showQuestion(new Question());
          } else if ($("meta[name=runsetup]").prop("content")) {
            setupSetup();
          } else if ($("meta[name=runsettings]").prop("content")) {
            startSettings();
          }
        });
      } catch (err) {
        console.error("could not start app, Error: ", err);
      }
      try {
        if (document.readyState == "complete") {
          loadElement.hide();
        }
        $(document).on("readystatechange", function () {
          try {
            if (document.readyState == "complete") {
              loadElement.hide();
            }
          } catch (err) {}
        });
      } catch (err) {}
    }
  } else {
    console.log("user logged out");
    localStorage.setItem("userData", "");
    localStorage.setItem("userId", "");
    new Toast(
      "Please login to use the app!",
      "default",
      1000,
      "../img/icon/info-icon.svg",
      $("meta[name=noauthenforce]").prop("content") ? "" : window.location.href.split("new/")[0] + "new/"
    );
  }
});

//! listeners
$("[auth='logout-button']").click((e) => {
  new Popup("Are you sure you want to sign out?", "box fullborder default", 10000, "../img/icon/info-icon.svg", [
    ["removePopup()", "Cancel", "secondary-action fullborder"],
    ["auth.signOut(); removePopup()", "Yes", "primary-action"],
  ]);
});
$("[auth='menu']").click((e) => {
  $(".auth-menu").toggleClass("collapsed");
  $(document.body).toggleClass("menuexpanded");
});
$(document.body).on("click scroll", (e) => {
  let target = $(e.target);
  if ($(document.body).hasClass("menuexpanded") && target.parent(".auth-menu").length == 0 && !target.attr("auth") && !target.hasClass("auth-menu")) {
    $(".auth-menu").addClass("collapsed");
    $(document.body).removeClass("menuexpanded");
  }
});
$("#mascot-slot").click(() => {
  window.location.href = "./";
});
try {
  messagechannelBroadcast.onmessage = (event) => {
    value = event.data.key;
    if (value == "reloadCashe") {
      window.location.reload(true);
    }
  };
} catch (err) {
  console.warn("could not setup BroadcastChannel listeners");
}

$(document.body).on("click", ".clear-sw", (e) => {
  // caches.keys().then(function (names) {
  //   for (let name of names) caches.delete(name);
  // });
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
  console.log("Cleared ServiceWorkers");
  localStorage.setItem("clearCashe", true);

  setTimeout(function () {
    try {
      messagechannelBroadcast.postMessage({ key: "clearsw" });
      new Toast("Cleared Service Workers and SW Cashe", "default", 1000, "../img/icon/info-icon.svg");
    } catch (err) {
      console.warn("could not send message on BroadcastChannel");
      new Toast(
        "Could not send message on BroadcastChannel, may not be supported on Safari or Chrome on iOS browsers < v14.5",
        "default",
        1000,
        "../img/icon/error-icon.svg"
      );
    }
  }, 1500);
});
$(document.body).on("click", "#delete-acc-button, #account-delete", (e) => {
  new Popup(
    "Are you sure you want to delete your account? <span class='delete-text'>THIS ACTION CANNOT BE REVERSED</span>",
    "box fullborder default",
    10000,
    "../img/icon/info-icon.svg",
    [
      ["removePopup()", "Cancel", "secondary-action fullborder"],
      ["auth.currentUser.delete(); removePopup()", "Yes", "primary-action blue-button delete-user"],
    ]
  );
});
