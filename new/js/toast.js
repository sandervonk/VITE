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
      toast.innerHTML += `<img src="${this.icon}" class="toast-icon">`;
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
        window.open(this.action, "_self");
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
    toast.classList.add(this.type);
    for (let actionInfo of this.action) {
      buttons += `<button class="popup-button box-button${
        actionInfo[2] == undefined ? "" : " " + actionInfo[2]
      }" onclick="${actionInfo[0]}">${actionInfo[1]}</button>`;
    }
    buttons += "</div>";
    toast.innerHTML +=
      (this.icon != null ? `<div class="popup-top-bar">` : "") +
      "<div class='popup-text'>" +
      this.message +
      `</div>` +
      (this.icon != null
        ? `<img src="${this.icon}" class="popup-icon"></div>`
        : "");
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
