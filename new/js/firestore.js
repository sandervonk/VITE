//listen for changes
function initChangeListeners() {
  //console.info("initializing change listeners");
  db.collection("users")
    .doc(auth.getUid())
    .onSnapshot(function (snapshot) {
      if (JSON.stringify(snapshot.data()) != localStorage.getItem("userData")) {
        //console.info("changes detected, reloading prefs");
        try {
          updatedJSON = JSON.parse(localStorage.getItem("userData"));
          clearTimeout(updateTimedFunction);
        } catch {
          console.warn("could not clear timed updates");
        }
        loadCookies();
      }
    });
}

function loadCookies() {
  //load user data from db
  return new Promise(function (fulfilled, rejected) {
    db.collection("users")
      .doc(auth.getUid())
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
    db.collection("users")
      .doc(auth.getUid())
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
            db.collection("users")
              .doc(auth.getUid())
              .set(levelJSON.data(), { merge: true })
              .then(() => {
                loadCookies().then(() => {
                  new Toast(
                    `Reset to path settings for "` + path + `"`,
                    "default",
                    1000,
                    "../img/icon/info-icon.svg"
                  );
                  fulfilled();
                });
              });
          });
      });
  });
}
function startSettings() {
  db.collection("users")
    .doc(auth.getUid())
    .get()
    .then((r) => {
      settings = r.data().prefs;
      if (settings == undefined) {
        db.collection("users")
          .doc(auth.getUid())
          .set(
            { prefs: { theme: "light", pacing: "no", saves: "yes" } },
            { merge: true }
          )
          .then(() => {
            setupSettings(settings);
          });
      } else {
        setupSettings(settings);
      }
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
    } else {
      console.warn("ignoring empty key: " + key);
    }
  }
  newJSON = filteredJSON;
  try {
    clearTimeout(updateTimedFunction);
  } catch {
    console.warn("could not clear previous update");
  }
  updateTimedFunction = setTimeout(function () {
    db.collection("users")
      .doc(auth.getUid())
      .set(filteredJSON, { merge: true });
  }, 2000);
}
