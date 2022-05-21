let tenseDefinitions = {
  pr: "Présent tense",
  pc: "Past tense",
  ps: "Past tense (literature)",
  im: "Past state or ongoing action",
  fs: "Future tense (intentions, predictions, conditional)",
  fa: "Future tense (actions previous to another)",
  co: "Conditional tense",
  cp: "Past conditional tense (regrets, what would / could have happened)",
  su: "Subjunctive Tense (opinions, emotions, and possibilities)",
  sp: "Past of the Subjunctive Tense (opinions, emotions, and possibilities)",
};

$(".tree-item").click((e) => {
  let target = $(e.target),
    windowWidth = $("#page-content").innerWidth();
  let offset = {
    left: target.offset().left - $("#page-content").offset().left,
    top: target.offset().top + $("#page-content").scrollTop(),
    width: Math.min(windowWidth * 0.75, 300),
  };
  offset.left += target.outerWidth() / 2;
  offset.left = Math.min(offset.left, windowWidth - offset.width * 0.5 - 16);
  offset.left = Math.max(offset.left, offset.width * 0.5 + 16);
  $("#learn-popup-container > *").addClass("collapse");
  popupTimeout = setTimeout(function () {
    $(document.body).removeClass("showpopup");
    $("#learn-popup-container > .collapse").remove();
    $(".collapse[info]").removeAttr("info");
  }, 175);
  target.attr("info", true);
  $(document.body).addClass("showpopup");
  let style = `top:${offset.top}px; left:${offset.left}px;`;
  $("#learn-popup-container").append(
    `<div id="learn-popup" class="expand-down box center" style="${style}">
        <div id="tense-name" class="primary">
            ${target.attr("tense")}
        </div>
        <div id="tense-def" class="">
            ${tenseDefinitions[target.attr("tenseshort")]}
        </div>
        <button id="learn-popup-action" class="box-button">LEARN</button>
        ${
          target[0].hasAttribute("badged")
            ? "<div id='learn-popup-message-separator'></div><div id='learn-popup-message' style='--badge-color:" +
              target.css("--badge-color") +
              "'>" +
              (target.attr("message") != undefined
                ? target.attr("message")
                : "[message]") +
              "</div>"
            : ""
        }
     </div>`
  );
});
let popupTimeout;
$(document.body).on("click", (e) => {
  if (
    $(e.target).hasClass("hidepopup")
    // || $(e.target).parent("hidepopup").length > 0
  ) {
    $("[info]").removeAttr("info");
    $("#learn-popup-container > *").addClass("collapse");
    popupTimeout = setTimeout(function () {
      $(document.body).removeClass("showpopup");
      $("#learn-popup-container > .collapse").remove();
    }, 175);
  }
});
$(window).on("resize", (e) => {
  $("#learn-popup-container > *").remove();
  $("[info]").click();
});
