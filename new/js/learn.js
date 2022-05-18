$(".tree-item").click((e) => {
  let target = $(e.target);
  let offset = {
    left: target.offset().left + target.outerWidth() / 2,
    top: target.offset().top + target.outerHeight(),
  };
  offset.left = Math.min(offset.left, $(window).width());
  $("#learn-popup-container > *").remove();
  $("#learn-popup-container").append(
    `<div id="learn-popup" class="expand-down box center" style="top:${
      offset.top
    }px; left:${offset.left}px;">${target.attr("tense")}</div>`
  );
});
