// stars
let limit = window.matchMedia("(orientation: landscape)").matches ? 150 : 75,
  body = document.body;
(loop = {
  start: function () {
    for (var t = 0; t <= limit; t++) {
      var n = this.newStar();
      (n.style.top = 100 * this.rand() + "%"), (n.style.left = 100 * this.rand() + "%"), (n.style.webkitAnimationDelay = this.rand() + "s"), (n.style.mozAnimationDelay = this.rand() + "s"), $("#bg-stars").append(n);
    }
  },
  rand: function () {
    return Math.random();
  },
  newStar: function () {
    var t = document.createElement("div");
    return (t.innerHTML = '<figure class="star"></figure>'), t.firstChild;
  },
}),
  loop.start();
// parallax
$("#error-text").plaxify({ xRange: 20, yRange: 20 });
$("#mascot").plaxify({ xRange: 5, yRange: 5 });
$("#earth-clouds").plaxify({ xRange: 10, yRange: 10 });
$("#earth-illustration").plaxify({ xRange: 20, yRange: 20, invert: true });
$("#bg-stars").plaxify({ xRange: 50, yRange: 50, invert: true });
$.plax.enable();
$(window).on("resize", function () {
  $.plax.disable({ restorePositions: true, clearlayers: true });
  $("#mascot, #earth-clouds, #earth-illustration, #bg-stars, #error-text").css({ top: "", left: "", transform: "" });
  $.plax.enable();
});
