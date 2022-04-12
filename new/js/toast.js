class Toast {
  constructor(message, type, duration) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.showToast();
  }
  showToast() {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(this.type);
    toast.innerHTML = this.message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, this.duration);
  }
}
