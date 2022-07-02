/** URI SEARCH TERMS **/

var params = new URLSearchParams(window.location.search);
history.replaceState({}, "", window.location.href.substr(0, window.location.href.length - window.location.search.length));

/** LOADCOVER **/

class LoadCover {
  constructor() {
    try {
      if ($("meta[name=waitforload]").prop("content") && $(".loadcover").length < 1) {
        $(document.body).append(`<div class="loadcover"></div>`);
      }
    } catch (err) {
      console.warn("could not setup loading animation, error:", err);
    }
  }
  hide() {
    $(".loadcover").addClass("hide");
    this.removeTheme();
  }
  remove() {
    this.hide();
    $(".loadcover").remove();
  }
  removeTheme() {
    $(".theme-load-color").remove();
  }
}

/** TOAST **/

class Toast {
  constructor(message, type, duration, iconPath, action) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.showToast();
  }
  showToast() {
    $(".toast").remove();
    let overlay = document.createElement("div"),
      toast = document.createElement("div");
    toast.classList.add("toast");
    overlay.classList.add("toast-overlay");
    toast.classList.add(this.type);
    if (this.icon != null) {
      toast.innerHTML += `<img src="${this.icon}" class="toast-icon" alt="Toast Popup Icon">`;
    }
    toast.innerHTML += this.message;
    if (this.action != null) {
      document.body.appendChild(overlay);
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      $(toast).css({ animation: "slideOut 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      overlay.remove();
      toast.remove();
      if (this.action != null) {
        window.location.href = this.action;
      }
    }, this.duration + 500);
  }
}

/** POPUP **/

class Popup {
  constructor(message, type, duration, iconPath, action) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.showPopup();
  }
  showPopup() {
    $(".popup, .popup-overlay").remove();
    let overlay = document.createElement("div"),
      toast = document.createElement("div"),
      buttons = "<div id='popup-buttons'>";
    toast.classList.add("popup");
    overlay.classList.add("popup-overlay");
    for (let classData of this.type.split(" ")) {
      toast.classList.add(classData);
    }
    for (let actionInfo of this.action) {
      buttons += `<button class="popup-button box-button${actionInfo[2] == undefined ? "" : " " + actionInfo[2]}" onclick="${actionInfo[0]}">${
        actionInfo[1]
      }</button>`;
    }
    buttons += "</div>";
    toast.innerHTML +=
      (this.icon != null ? `<div class="popup-top-bar">` : "") +
      "<div class='popup-text'>" +
      this.message +
      `</div>` +
      (this.icon != null ? `<img src="${this.icon}" class="popup-icon" alt="Popup Icon"></div>` : "");
    toast.innerHTML += buttons;
    if (this.action != null) {
      document.body.appendChild(overlay);
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      $(toast).css({ animation: "fadeout 0.5s forwards" });
      $(overlay).css({ animation: "fadeout 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      $(toast).remove();
      $(overlay).remove();
    }, this.duration + 500);
  }
}
function removePopup() {
  $(".popup").css({ animation: "fadeout 0.5s forwards" });
  $(".popup-overlay").css({ animation: "fadeout 0.5s forwards" });
  setTimeout(() => {
    $(".popup").remove();
    $(".popup-overlay").remove();
  }, 500);
}
$(document.body).on("click", ".popup-overlay", function () {
  removePopup();
});

var loadElement = new LoadCover();

/** THEME **/
try {
  if (JSON.parse(localStorage["userData"]).prefs.theme == "dark") {
    document.getElementById("theme-dark-stylesheet").setAttribute("media", "not print");
    for (darkColor of document.querySelectorAll("#theme-dark-color")) {
      darkColor.setAttribute("media", "not print");
    }
    for (lightColor of document.querySelectorAll("#theme-light-color")) {
      lightColor.setAttribute("media", "(prefers-color-scheme: unset) and not(print)");
    }
  } else {
    document;
    for (lightColor of document.querySelectorAll("#theme-light-color")) {
      lightColor.setAttribute("media", "not print");
    }
  }
} catch (err) {
  console.error("Error setting theme: ", err);
}
