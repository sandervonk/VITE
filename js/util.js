"use strict";
/** URI SEARCH TERMS **/
var params = new URLSearchParams(window.location.search);
if (window.history) {
  history.replaceState({}, "", window.location.href.substr(0, window.location.href.length - window.location.search.length));
}
params.set("home_page", window.location.href.split("/VITE")[0] + "/VITE");
var verbs = {},
  lastMousePos = { x: 0, y: 0 };

$(window).on("touchdown touchstart touchstop click", function (e) {
  lastMousePos = function (e) {
    let x, y;
    if (e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else if (e.originalEvent && e.originalEvent.changedTouches[0]) {
      x = e.originalEvent.changedTouches[0].clientX;
      y = e.originalEvent.changedTouches[0].clientY;
    }
    return { x: x, y: y };
  };
});
/** context menu **/
// disable context menu if meta tag exists
if ($("meta[name='docontextmenu']").attr("content") != "false") {
  $(document).on(`contextmenu${(navigator ? navigator.userAgent.match(/iPhone|iPad|iPod/i) && CSS.supports("-webkit-touch-callout: none") : false) ? " long-press" : ""}`, function (e) {
    e.preventDefault();
    if ((e.clientX == e.clientY) == 1) {
      e.clientX = lastMousePos.x;
      e.clientY = lastMousePos.y;
    }
    try {
      e.target = document.elementFromPoint(e.clientX, e.clientY);
    } catch (err) {
      console.warn("could not get elementFromPoint", err);
    }
    if (!$(e.target).hasClass("context-overlay") || window.matchMedia("(min-width: 50px)").matches) {
      $(".context-menu, .context-overlay").remove();
      e.target = document.elementFromPoint(e.clientX, e.clientY);
      let menu_items = $("meta[name='cm-options']").attr("content"),
        target_options = $(e.target).attr("cm-options");
      menu_items = menu_items != undefined ? menu_items + "," : "";
      menu_items = target_options ? menu_items + target_options : menu_items;
      try {
        menu_items = menu_items != "undefined" ? JSON.parse("[" + menu_items + "]") : menu_items;
      } catch (err) {
        console.warn("Something went wrong applying context menu options from the <meta> tag!\n\n", menu_items, "\n\n", err);
        menu_items = [];
      }
      let menu_options = {
        width: 300,
        extras_callback: function () {
          try {
            let result = getCMOptions();
            return result ? result : false;
          } catch (err) {
            console.warn("Could not run getCMOptions()", "\n\n", err);
            return false;
          }
        },
      };
      new ContextMenu(e, this, menu_items, menu_options);
    }
  });
}
function closeContextMenu() {
  $(document.body).removeAttr("contextmenu");
  $(".context-menu, .context-overlay").addClass("close");
  setTimeout(function () {
    $(".context-menu, .context-overlay").remove();
  }, 200);
  $(document.body).children("[tabindex]").removeAttr("tabindex");
}

$(window).on("click", "body[contextmenu] > *:not(.context-menu)", closeContextMenu);
$(document).on("click", ".context-overlay", closeContextMenu);
$(window).on("keydown blur resize", function (event) {
  if (event.key === "Escape" || !event.key) {
    event.preventDefault();
    closeContextMenu();
  }
});
$(window).on("keydown", function (e) {
  //if focus outside of the context menu (by tabbing) list it in the console
  if ($(".context-menu").length) {
    if (e.key === "Enter" && $(".context-menu .cm-item:focus").length) {
      e.preventDefault();
      $(".context-menu .cm-item:focus").click();
    } else if (e.key.includes("Arrow") && $(".context-menu .cm-item:focus").length) {
      e.preventDefault();
      let focused = $(".context-menu .cm-item:focus"),
        key = e.key.replace("Arrow", "");
      let next = $(`.context-menu .cm-item[tabindex="${parseInt(focused.attr("tabindex")) + 1}"]`),
        prev = $(`.context-menu .cm-item[tabindex="${parseInt(focused.attr("tabindex")) - 1}"]`),
        chosen = {};
      if (key == "Up" && prev.length && !focused.parent().is(prev.parent())) {
        // if the previous and current items are in the same section, continue to the ArrowLeft logic, otherwise, pick the first item of the previous section
        chosen = prev.parent().children().first();
      } else if (key == "Down" && next.length && next.parent().attr("id") == "cm-buttons") {
        // if the next and current items are in the same section, continue to the ArrowRight logic, otherwise, pick the first item of the next section
        chosen = $("#cm-scrollable").children().first().children().first();
      } else if (key == "Down" || key == "Right") {
        chosen = next;
      } else if (key == "Up" || key == "Left") {
        chosen = prev;
      }
      if (chosen.length) chosen.focus();
    } else if (e.key === "Tab" && $(".context-menu").length && ($("*:focus").closest(".context-menu").length == 0 || $(".context-menu > #cm-scrollable > #cm-default-items > :last-child:focus").length)) {
      e.preventDefault();
      $(".context-menu .cm-item").first().focus();
    }
  }
});
class ContextMenu {
  constructor(e, item_ref, menuItems = [], options = { width: 300 }) {
    this.defaults = [
      {
        icon: "cm-home",
        text: "Go to home",
        onclick: `window.location.href = "${params.get("home_page")}/app"`,
        button: true,
      },
      {
        icon: "cm-back",
        text: "Go back a page",
        onclick: `window.history.go(-1)`,
        button: true,
      },
      {
        icon: "cm-link",
        text: "Copy link to this page",
        onclick: `copyToClipboard("${window.location.href}", closeContextMenu)`,
        button: true,
      },
      {
        icon: "cm-share",
        text: "Share this page",
        onclick: `sharePage(closeContextMenu)`,
        button: true,
      },
      {
        icon: "cm-close",
        text: "Use system menu",
        onclick: `$(document).off("contextmenu long-press");closeContextMenu();`,
      },
    ];
    this.options = options;
    this.windowPadding = 10;
    this.menuItems = menuItems;
    if (options.extras_callback) {
      let result = options.extras_callback();
      if (result.length) {
        this.menuItems = this.menuItems.concat(result);
      }
    }
    [this.x, this.y] = [e.clientX, e.clientY];
    this.build(this.x, this.y);
  }
  makeMenuItem(item) {
    return $(`<div class='cm-item' onclick='${item.onclick ? item.onclick : ""}'><img class='cm-icon' src='/VITE/img/icon/cm/${item.icon}.svg' /><span>${item.text}</span></div>`);
  }
  makeMenuButton(item) {
    return $(`<div class='cm-item cm-button' title='${item.text}' onclick='${item.onclick ? item.onclick : ""}'><img class='cm-icon' src='/VITE/img/icon/cm/${item.icon}.svg'/></div>`);
  }
  build(x, y) {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE
      document.selection.empty();
    }
    this.menu = $("<div class='context-menu'></div>");
    this.menu.css({
      top: y,
      left: x,
      width: this.options.width ? this.options.width : "",
    });
    this.actionButtons = $("<div id='cm-buttons'></div>");
    this.defaults.forEach((item) => {
      if (item.button) {
        this.actionButtons.append(this.makeMenuButton(item));
      }
    });
    this.pageItems = $("<div id='cm-page-items'></div>");
    this.menuItems.forEach((item) => {
      if (!item.button) {
        this.pageItems.append(this.makeMenuItem(item));
      } else {
        this.actionButtons.append(this.makeMenuButton(item));
      }
    });
    this.defaultItems = $("<div id='cm-default-items'><hr class='cm-separator' /></div>");
    this.defaults.forEach((item) => {
      if (!item.button) {
        this.defaultItems.append(this.makeMenuItem(item));
      }
    });
    this.scrollableItems = $("<div id='cm-scrollable'></div>");
    this.scrollableItems.append(this.pageItems, this.defaultItems);
    $(this.menu).append(this.actionButtons, this.scrollableItems);
    $(document.body).append(`<div class='context-overlay'></div>`, this.menu);
    $(document.body).attr("contextmenu", "");
    this.realign(x, y);
    // for each menu item, add a increasing tabindex to make them accessible by keyboard
    $(".context-menu .cm-item").each(function (i) {
      $(this).attr("tabindex", i + 1);
    });
    $(".context-menu .cm-item").first().focus();
  }
  realign(x, y) {
    this.menu.focus();
    this.menu.focusin();
    this.menu.css({
      top: Math.max(this.windowPadding, Math.min(y, $(window).height() - this.menu.outerHeight() - this.windowPadding)),
      left: Math.max(this.windowPadding, Math.min(x, $(window).width() - this.menu.outerWidth() - this.windowPadding)),
      "transform-origin": `${this.x - Math.max(this.windowPadding, Math.min(x, $(window).width() - this.menu.outerWidth() - this.windowPadding))}px ${this.y - Math.max(this.windowPadding, Math.min(y, $(window).height() - this.menu.outerHeight() - this.windowPadding))}px`,
    });
    if ($("#cm-page-items:empty").length) {
      $(".context-menu").css("height", "fit-content");
    }
  }
}

/** LOADCOVER **/

class LoadCover {
  constructor() {
    try {
      if ($("meta[name=waitforload]").prop("content") && $(".loadcover").length < 1) {
        $(document.body).append(`<div class="loadcover" style="z-index: 1000;"></div>`);
      }
    } catch (err) {
      console.warn("could not setup loading animation, error:", err);
    }
  }
  hide() {
    $(".loadcover").addClass("hide");
    this.removeTheme();
    removeTimer();
  }
  remove() {
    this.hide();
    $(".loadcover").remove();
    removeTimer();
  }
  removeTheme() {
    $(".theme-load-color").remove();
    removeTimer();
  }
  removeTimer() {
    try {
      clearTimeout(this.timeoutId);
    } catch (err) {
      console.warn("No timeout to cancel:", err);
    }
  }
}

/** TOAST **/

class Toast {
  constructor(message, type, duration, iconPath = "", action = "") {
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
    if (this.icon != "") {
      toast.innerHTML += `<img src="${this.icon}" class="toast-icon" alt="Toast Popup Icon">`;
    }
    toast.innerHTML += this.message;
    if (this.action != "") {
      document.body.appendChild(overlay);
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      $(toast).css({ animation: "slideOut 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      overlay.remove();
      toast.remove();
      if (this.action != "" && this.action != "") {
        window.location.href = this.action;
      }
    }, this.duration + 500);
  }
}
class ErrorToast extends Toast {
  constructor(message, err, duration, action = "") {
    message += ": " + err;
    super(message, "default", duration, "/VITE/img/icon/error-icon.svg", action);
  }
}
/** POPUP **/

class Popup {
  constructor(message, type, duration, iconPath = "", action = "") {
    if (typeof message == "object") {
      this.title = message[0];
      this.message = message[1];
    } else {
      this.message = message;
    }
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.showPopup();
  }
  showPopup() {
    $(".popup, .popup-overlay").remove();
    let overlay = $("<div></div>", { class: "popup-overlay " + this.type }),
      toast = $("<div></div>", { class: "popup" }),
      buttons = $("<div></div>", { id: "popup-buttons" });

    for (let actionInfo of this.action) {
      $("<button></button>", { class: "popup-button " + (actionInfo[2] ? actionInfo[2] : ""), onclick: actionInfo[0], text: actionInfo[1] }).appendTo(buttons);
    }
    if (this.icon) {
      $("<img alt='icon'>", { src: this.icon, class: "popup-icon", alt: "Popup Icon" }).appendTo(toast);
    }
    if (this.title) {
      $("<div></div>", { text: this.title, class: "popup-title" }).appendTo(toast);
    }
    $("<div></div>", { text: this.message, class: "popup-text" }).appendTo(toast);
    buttons.appendTo(toast);

    if (this.action) {
      overlay.appendTo(document.body);
    }
    toast.appendTo(document.body);
    setTimeout(() => {
      $(toast).css({ animation: "popupout 0.25s forwards" });
      $(overlay).css({ animation: "fadeout 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      toast.remove();
      overlay.remove();
    }, this.duration + 500);
  }
}
function removePopup() {
  $(".popup").css({ animation: "popupout 0.25s forwards" });
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

//other
$("[placeholdaction]").click(function () {
  new Toast("This feature hasn't been implemented yet, sorry! 🤫", "default", 1500, "/VITE/img/icon/concern-icon.svg");
});
function copyToClipboard(text, callback = function () {}) {
  navigator.clipboard
    .writeText(text)
    .then((res) => {
      new Toast("Copied link code to clipboard", "transparent", 750, "/VITE/img/icon/clipboard-icon.svg");
      callback();
    })
    .catch((err) => {
      new ErrorToast("Couldn't copy the link, sorry!" + err.toString(), 2000);
    });
}
function getDefaultPageData() {
  return {
    title: $("meta[name='og:description']").attr("content") ? $("meta[name='og:description']").attr("content") : "Conjugate French verbs, learn new tenses, or practice existing ones, all 100% free with VITE! French tools!",
    description: $("meta[name='og:site_name']").attr("content") ? $("meta[name='og:site_name']").attr("content") : document.title,

    url: $("meta[name='og:url']").attr("content") ? $("meta[name='og:url']").attr("content") : window.location.href,
  };
}
function sharePage(callback = function () {}) {
  navigator
    .share(getDefaultPageData())
    .then((res) => {
      new Toast("Opened share options!", "transparent", 750, "/VITE/img/icon/clipboard-icon.svg");
      callback();
    })
    .catch((err) => {
      new ErrorToast("Couldn't open share options, sorry!" + err.toString(), 2000);
    });
}
function fixPFPResolution(img_url) {
  try {
    return img_url.replace("=s96-c", "=s100-c");
  } catch (err) {
    return img_url;
  }
}
function setupTheme(jsonIn) {
  try {
    if ((jsonIn && jsonIn.theme == "dark") || JSON.parse(localStorage["userData"]).prefs.theme == "dark") {
      $("#theme-dark-stylesheet, #theme-dark-color").attr("media", "not print");
      $("#theme-light-color, #theme-light-stylesheet").attr("media", "(prefers-color-scheme: unset) and not(print)");
    } else {
      $("#theme-light-stylesheet, #theme-light-color").attr("media", "not print");
      $("#theme-dark-color, #theme-dark-stylesheet").attr("media", "(prefers-color-scheme: unset) and not(print)");
    }
  } catch (err) {
    console.warn("Couldn't Set Theme: \n\n", err);
  }
}
setupTheme();
/** LONG PRESS EVENT **/
/*!
 * long-press-event - v2.4.4
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!(function (e, t) {
  "use strict";
  var n = null,
    a = "PointerEvent" in e || (e.navigator && "msPointerEnabled" in e.navigator),
    i = "ontouchstart" in e || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    o = a ? "pointerdown" : i ? "touchstart" : "mousedown",
    r = a ? "pointerup" : i ? "touchend" : "mouseup",
    m = a ? "pointermove" : i ? "touchmove" : "mousemove",
    u = 0,
    s = 0,
    c = 10,
    l = 10;
  function v(e) {
    f(),
      (e = (function (e) {
        if (void 0 !== e.changedTouches) return e.changedTouches[0];
        return e;
      })(e)),
      this.dispatchEvent(
        new CustomEvent("long-press", {
          bubbles: !0,
          cancelable: !0,
          detail: { clientX: e.clientX, clientY: e.clientY },
          clientX: e.clientX,
          clientY: e.clientY,
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          pageX: e.pageX,
          pageY: e.pageY,
          screenX: e.screenX,
          screenY: e.screenY,
        })
      ) ||
        t.addEventListener(
          "click",
          function e(n) {
            t.removeEventListener("click", e, !0),
              (function (e) {
                e.stopImmediatePropagation(), e.preventDefault(), e.stopPropagation();
              })(n);
          },
          !0
        );
  }
  function d(a) {
    f(a);
    var i = a.target,
      o = parseInt(
        (function (e, n, a) {
          for (; e && e !== t.documentElement; ) {
            var i = e.getAttribute(n);
            if (i) return i;
            e = e.parentNode;
          }
          return a;
        })(i, "data-long-press-delay", "1000"),
        10
      );
    n = (function (t, n) {
      if (!(e.requestAnimationFrame || e.webkitRequestAnimationFrame || (e.mozRequestAnimationFrame && e.mozCancelRequestAnimationFrame) || e.oRequestAnimationFrame || e.msRequestAnimationFrame)) return e.setTimeout(t, n);
      var a = new Date().getTime(),
        i = {},
        o = function () {
          new Date().getTime() - a >= n ? t.call() : (i.value = requestAnimFrame(o));
        };
      return (i.value = requestAnimFrame(o)), i;
    })(v.bind(i, a), o);
  }
  function f(t) {
    var a;
    (a = n) && (e.cancelAnimationFrame ? e.cancelAnimationFrame(a.value) : e.webkitCancelAnimationFrame ? e.webkitCancelAnimationFrame(a.value) : e.webkitCancelRequestAnimationFrame ? e.webkitCancelRequestAnimationFrame(a.value) : e.mozCancelRequestAnimationFrame ? e.mozCancelRequestAnimationFrame(a.value) : e.oCancelRequestAnimationFrame ? e.oCancelRequestAnimationFrame(a.value) : e.msCancelRequestAnimationFrame ? e.msCancelRequestAnimationFrame(a.value) : clearTimeout(a)), (n = null);
  }
  "function" != typeof e.CustomEvent &&
    ((e.CustomEvent = function (e, n) {
      n = n || { bubbles: !1, cancelable: !1, detail: void 0 };
      var a = t.createEvent("CustomEvent");
      return a.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), a;
    }),
    (e.CustomEvent.prototype = e.Event.prototype)),
    (e.requestAnimFrame =
      e.requestAnimationFrame ||
      e.webkitRequestAnimationFrame ||
      e.mozRequestAnimationFrame ||
      e.oRequestAnimationFrame ||
      e.msRequestAnimationFrame ||
      function (t) {
        e.setTimeout(t, 1e3 / 60);
      }),
    t.addEventListener(r, f, !0),
    t.addEventListener(
      m,
      function (e) {
        var t = Math.abs(u - e.clientX),
          n = Math.abs(s - e.clientY);
        (t >= c || n >= l) && f();
      },
      !0
    ),
    t.addEventListener("wheel", f, !0),
    t.addEventListener("scroll", f, !0),
    t.addEventListener(
      o,
      function (e) {
        (u = e.clientX), (s = e.clientY), d(e);
      },
      !0
    );
})(window, document);
