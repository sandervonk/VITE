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
function setupTheme(jsonIn) {
  if (jsonIn.theme === "dark") {
    $("#theme-dark-stylesheet").attr("media", "");
  } else {
    $("#theme-dark-stylesheet").attr("media", "(prefers-color-scheme: unset)");
  }
}
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
}
var settings;

function setupSettings(jsonIn) {
  for (let key of Object.keys(jsonIn)) {
    let switchSel = "[name=" + key + "][value=" + jsonIn[key] + "]";
    $(switchSel).attr("checked", true);
  }
  setupTheme(jsonIn);
}
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
    let next = order[order.indexOf(current) + 1],
      nextTab = ".footer-item#" + next + "-tab";
    if (next != "none") {
      $();
      $(".footer-item").removeClass("active");
      $(nextTab).addClass("active");
      $("#page-content, body").attr("activetab", next);
      this.setText(next);
    } else if (next == "none") {
      window.location.href = "./";
    }
  }
  setText(tabName) {
    $(this.parent)
      .children("#tutorial-title")
      .text(tutorialTabs[tabName].title);
    $(this.parent)
      .children("#tutorial-description")
      .text(tutorialTabs[tabName].description);
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
  $("#learn-type-input").val($(e.target).closest(".learn-card").attr("name"));
  $("#learn-start").submit();
});
