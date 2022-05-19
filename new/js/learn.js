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
  $("[info]").removeAttr("info");
  target.attr("info", true);
  $("#learn-popup-container > *").remove();
  $(document.body).addClass("showpopup");
  let style = `top:${offset.top}px; left:${offset.left}px;`;
  $("#learn-popup-container").append(
    `<div id="learn-popup" class="expand-down box center" style="${style}">
        <div id="tense-name">
            ${target.attr("tense")}
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
$(document.body).on("click", "", (e) => {
  console.log("outside");
  $(document.body).removeClass("showpopup");
});
$(window).on("resize", (e) => {
  $("#learn-popup-container > *").remove();
  $("[info]").click();
});
