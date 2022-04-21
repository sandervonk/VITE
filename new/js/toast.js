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
  constructor(message, type, duration, iconPath, [action, actionMsg]) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.actionText = actionMsg;
    this.showPopup();
  }
  showPopup() {
    $(".popup").remove();
    $(".toast-overlay").remove();
    let overlay = document.createElement("div"),
      toast = document.createElement("div");
    toast.classList.add("popup");
    overlay.classList.add("toast-overlay");
    toast.classList.add(this.type);
    toast.innerHTML +=
      (this.icon != null ? `<div class="popup-top-bar">` : "") +
      "<div class='popup-text'>" +
      this.message +
      `</div>` +
      (this.icon != null
        ? `<img src="${this.icon}" class="popup-icon"></div>`
        : "");
    toast.innerHTML += `<button class="popup-button box-button" onclick="${this.action}">${this.actionText}</button>`;
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
  $(".toast-overlay").css({ animation: "fadeout 0.5s forwards" });
  setTimeout(() => {
    $(".popup").remove();
    $("toast-overlay").remove();
  }, 500);
}
