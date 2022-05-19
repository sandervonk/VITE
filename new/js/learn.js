$(".tree-item").click((e) => {
  let target = $(e.target);
  let offset = {
    left: target.offset().left,
    top: target.offset().top + target.outerHeight(),
    width: Math.min($(window).width() * 0.75, 300),
  };
  offset.left += target.outerWidth() / 2;
  console.log(offset);
  offset.left = Math.min(
    offset.left,
    $(window).width() - offset.width * 0.5 - 16
  );
  offset.left = Math.max(offset.left, offset.width * 0.5 + 16);
  console.log(offset);
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
        <button id="learn-popup-action">LEARN</button>
     </div>`
  );
});
$(document.body).on("click", ".showpopup", (e) => {
  console.log("outside");
  $(document.body).removeClass("showpopup");
});
$(window).on("resize", (e) => {
  $("#learn-popup-container > *").remove();
  $("[info]").click();
});
