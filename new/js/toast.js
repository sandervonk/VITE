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
