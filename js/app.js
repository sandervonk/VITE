"use strict";
let tutorialTabs = {
  learn: {
    title: "The Learn Tab",
    description: "This tab is your go-to place for everything learning. It'll provide you access to different activities at the touch of a tile!",
  },
  settings: {
    title: "The Settings Tab",
    description: "Customize your learning experience here, with theme toggles, pace re-adjustments, and more!",
  },
  announcements: {
    title: "The Announcements Tab",
    description: "Learn about new features and find more information about how you can best improve your learning experience here",
  },
};

class tutorialObject {
  constructor() {
    this.start();
  }
  start() {
    $("#page-content, body").addClass("tutorial");
    $(document.body).on("click", "#body.tutorial .footer-item", (e) => {
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
    if (next != "none") {
      $(".footer-item").removeClass("active");
      $(nextTab).addClass("active");
      $("#page-content, body").attr("activetab", next);
      this.setText(next);
    } else if (next == "none" && params.get("classPanel") == "true") {
      new Toast("Opening the class panel", "default", 750, "/VITE/img/icon/group-info-icon.svg", "/VITE/class/");
    } else if (next == "none") {
      window.location.href = "./";
    }
  }
  setText(tabName) {
    $("#tutorial-title").text(tutorialTabs[tabName].title);
    $("#tutorial-description").text(tutorialTabs[tabName].description);
  }
}
let path = params.get("path"),
  showTutorial = params.get("showTutorial");
var tutorialClass;
if (path != null) {
  localStorage["learningPath"] = path;
}
if (showTutorial == "true") {
  tutorialClass = new tutorialObject();
} else if (params.get("classPanel") == "true") {
  new Toast("Opening the class panel", "default", 750, "/VITE/img/icon/group-info-icon.svg", "/VITE/class/");
}
$(document.body).on("click", ".footer-item", (e) => {
  setTab(e.target.id, true);
  try {
    tutorialClass.setText(e.target.id.replace("-tab", ""));
  } catch (err) {}
});

function saveSettings(form) {
  let object = {};
  new FormData(form).forEach(function (value, key) {
    console.log(key);
    if (["theme"].includes(key)) {
      object[key] = value;
    }
  });
  setupTheme(object);
  let settingsJSON = JSON.stringify(object);
  userDoc().set({ prefs: object }, { merge: true });
  localStorage["settings"] = settingsJSON;
}
$("#settings-tab .switch-toggle").click((e) => {
  saveSettings($("#settings-form")[0]);
});
$(".learn-card").click((e) => {
  window.location.href = $(e.target).closest(".learn-card").attr("page") + "?type=" + $(e.target).closest(".learn-card").attr("name");
});
function setTab(tabFull, scroll) {
  let tab = tabFull.replace("-tab", ""),
    tabElement = $("#" + tabFull);
  $(".footer-item").removeClass("active");
  $(`.footer-item#${tab}-tab`).addClass("active");
  $("#page-content, body").attr("activetab", tab);
  if (scroll) {
    tabElement[0].scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }
  if (tabElement.scrollTop() > 0) {
    tabElement.animate({ scrollTop: 0 }, 500, function () {
      $(document.body).removeAttr("header-collapsed");
    });
  } else {
    $(document.body).removeAttr("header-collapsed");
  }
}
$("#tab-container").scroll((e) => {
  let left = Math.round($("#tab-container").scrollLeft() / $("#tab-container").width()),
    tabs = ["learn-tab", "settings-tab", "announcements-tab"];
  setTab(tabs[left]);
});
function calcDays(date1, date2) {
  return Math.round(Math.abs(date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000));
}
try {
  $(".announcement-date").each((i, e) => {
    let daysSince = calcDays(new Date(), new Date($(e).text()));
    $(e).text(daysSince + (daysSince == 1 ? " day" : " days") + " ago");
  });
} catch (e) {}

/** SCROLL **/
$(function () {
  var lastScrollTop = 0,
    delta = 40;
  $(".tab").scroll(function () {
    var scrollTop = $(this).scrollTop(),
      maxScrollTop = $(this)[0].scrollHeight - $(this).outerHeight();
    if (Math.abs(scrollTop - lastScrollTop) >= delta && scrollTop > 50) {
      if (scrollTop > lastScrollTop) {
        $(document.body).attr("header-collapsed", "");
        $("#account-menu").addClass("collapsed");
      } else if (scrollTop < maxScrollTop - 2) {
        $(document.body).removeAttr("header-collapsed");
      }
      lastScrollTop = scrollTop;
    } else if (scrollTop == 0) {
      $(document.body).removeAttr("header-collapsed");
      lastScrollTop = scrollTop;
    }
  });
});
$(document).on("click", "body[header-collapsed] header", (e) => {
  $(".tab").animate({ scrollTop: 0 }, 500, function () {
    $(document.body).removeAttr("header-collapsed");
  });
});
