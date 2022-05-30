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
    $(".loadcover").remove();
    this.removeTheme();
  }
  removeTheme() {
    $(".theme-load-color").remove();
  }
}
var loadElement = new LoadCover();
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
    $(".popup").remove();
    $(".popup-overlay").remove();
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
