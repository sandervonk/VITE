let tutorialTabs = {
  learn: {
    title: "The Learn Tab",
    description:
      "This tab is your go-to place for everything learning. It'll provide you access to different activities at the touch of a tile!",
  },
  settings: {
    title: "The Settings Tab",
    description:
      "Customize your learning experience here, with theme toggles, pace re-adjustments, and more!",
  },
  announcements: {
    title: "The Announcements Tab",
    description:
      "Learn about new features and find more information about how you can best improve your learning experience here",
  },
};

var settings;

class tutorialObject {
  constructor() {
    this.start();
  }
  start() {
    $("#page-content, body").addClass("tutorial");
    $(document.body).on("click", "#page-content.tutorial .footer-item", (e) => {
      this.setText(e.target.id.replace("-tab", ""));
    });
    $("#tutorial-overlay-zone").click(function () {
      tutorialClass.next();
    });
  }
  next() {
    let order = ["learn", "settings", "announcements", "none"],
      current = $(".footer-item.active")[0].id.replace("-tab", "");
    let next = order[order.indexOf(current) + 1];
    let nextTab = ".footer-item#" + next + "-tab";
    console.log(next, nextTab);
    if (next != "none") {
      console.log("next != 'none'");
      $(".footer-item").removeClass("active");
      $(nextTab).addClass("active");
      $("#page-content, body").attr("activetab", next);
      this.setText(next);
    } else if (next == "none") {
      window.location.href = "./";
    }
  }
  setText(tabName) {
    $("#tutorial-title").text(tutorialTabs[tabName].title);
    $("#tutorial-description").text(tutorialTabs[tabName].description);
  }
}
let url = window.location.href,
  params = new URL(url).searchParams,
  path = params.get("path"),
  showTutorial = params.get("showTutorial");
var tutorialClass;
if (path != null) {
  localStorage["learningPath"] = path;
}
if (showTutorial == "true") {
  tutorialClass = new tutorialObject();
}
$(".footer-item").click((e) => {
  $(".footer-item").removeClass("active");
  $(e.target).addClass("active");
  $("#page-content, body").attr("activetab", e.target.id.replace("-tab", ""));
  try {
    tutorialClass.setText(e.target.id.replace("-tab", ""));
  } catch (err) {}
});

function saveSettings(form) {
  let object = {};
  new FormData(form).forEach(function (value, key) {
    object[key] = value;
  });
  setupTheme(object);
  let settingsJSON = JSON.stringify(object);
  db.collection("users")
    .doc(auth.getUid())
    .set({ prefs: object }, { merge: true });
  localStorage["settings"] = settingsJSON;
}
$("#settings-tab .switch-toggle").click((e) => {
  saveSettings($("#settings-form")[0]);
});
$(".learn-card").click((e) => {
  window.location.href =
    $(e.target).closest(".learn-card").attr("page") +
    "?type=" +
    $(e.target).closest(".learn-card").attr("name");
});
function setTab(tab) {
  tab = tab.replace("-tab", "");
  $(".footer-item").removeClass("active");
  $(`.footer-item#${tab}-tab`).addClass("active");
  $("#page-content, body").attr("activetab", tab);
}
$("#page-content")
  .swipeDetector({
    swipeThreshold: Math.min(150, $("#page-content").width() * 0.75),
    useOnlyTouch: true,
  })
  .on("swipeLeft.sd swipeRight.sd swipeUp.sd swipeDown.sd", function (event) {
    let active = $(document.body).attr("activetab");
    if (event.type == "swipeLeft") {
      if (active == "learn") {
        setTab("settings");
      } else if (active == "settings") {
        setTab("announcements");
      }
    } else if (event.type == "swipeRight") {
      if (active == "settings") {
        setTab("learn");
      } else if (active == "announcements") {
        setTab("settings");
      }
    } else if (event.type == "swipeUp") {
      //close menu
    }
  });
$("#page-content")
  .swipeDetector({
    swipeThreshold: Math.min(400, $("#page-content").height() * 0.7),
  })
  .on("swipeLeft.sd swipeRight.sd swipeUp.sd swipeDown.sd", function (event) {
    if (event.type == "swipeDown") {
      //open menu
    }
  });
