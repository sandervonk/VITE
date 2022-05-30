var mascot = $("#answer-mascot"),
  observer = new MutationObserver((changes) => {
    changes.forEach((change) => {
      if (change.attributeName.includes("mood")) {
        $("#answer-mascot").attr("src", `../img/mascot/${mascot.attr("mood")}.svg`);
      }
      if (change.attributeName.includes("full")) {
        $("#answer-mascot").attr("src", `../img/mascot/${mascot.attr("full")}.svg`);
      }
    });
  });
observer.observe(mascot[0], { attributes: true });
$("#answer-input").on("change, input", (e) => {
  if (e.target.value != "") {
    $("#next-button").addClass("avaliable");
    $(document.body).attr("avaliable", true);
  } else {
    $("#next-button").removeClass("avaliable");
    $(document.body).removeAttr("avaliable");
  }
});
$(document.body).on("keypress", (e) => {
  if (e.which == 13 || e.keyCode == 13) {
    e.preventDefault();
    //Submit Question
    if ($("#answer-input").val() == "") {
      submitAnswer(true);
    } else {
      submitAnswer();
    }
    $(document.body).attr("info", null);
  }
});
function randomItem(arrayIn) {
  return arrayIn[Math.floor(Math.random() * arrayIn.length)];
}
$(document.body).on("click", "#next-button", function () {
  //Submit Question
  if ($("#next-button").hasClass("avaliable") || $("body[showanswer] #next-button").hasClass("box-button")) submitAnswer();
  $(document.body).attr("info", null);

  $("#next-button").removeClass("avaliable");
});

$(document.body).on("click", "#skip-button", function () {
  //Submit Question
  submitAnswer(true);
  $(document.body).attr("info", null);

  $("#next-button").removeClass("avaliable");
});
$(document.body).click((e) => {
  if (e.target.id != "vite-q-tense" && e.target.id != "vite-q-verb" && e.target.id != "vite-q-subject" && e.target.id != "info-popup") {
    $(document.body).attr("info", null);
  }
});
$(window).on("resize", () => {
  $(document.body).attr("info", null);
});

$("#vite-q-tense,#vite-q-subject,#vite-q-verb").click((e) => {
  $(document.body).attr("info", "");
  $("#info-popup").text(e.target.getAttribute("info"));
  $("#info-popup").css({
    top: e.target.offsetTop + e.target.offsetHeight,
    left: e.target.offsetLeft,
    "max-width": document.body.offsetWidth - (e.target.offsetLeft - (document.documentElement.offsetWidth - document.body.offsetWidth) / 2) - 34,
  });
});
