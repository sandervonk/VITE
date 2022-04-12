class Toast {
  constructor(message, type, duration) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.showToast();
  }
  showToast() {
    let overlay = document.createElement("div"),
      toast = document.createElement("div");
    toast.classList.add("toast");
    overlay.classList.add("toast-overlay");
    toast.classList.add(this.type);
    toast.innerHTML = this.message;
    document.body.appendChild(toast);
    setTimeout(() => {
      overlay.remove();
      toast.remove();
    }, this.duration);
  }
}
