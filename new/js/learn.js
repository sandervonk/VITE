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
     </div>`
  );
});
$(document.body).on("click", (e) => {
  console.log(e.target);
  if (
    $(e.target).hasClass("hidepopup")
    // || $(e.target).parent("hidepopup").length > 0
  ) {
    $(document.body).removeClass("showpopup");
    $("#learn-popup-container > *").remove();
    $("[info]").removeAttr("info");
  }
});
$(window).on("resize", (e) => {
  $("#learn-popup-container > *").remove();
  $("[info]").click();
});
