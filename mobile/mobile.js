$(document.body)
  .on("focus", "textarea, input", function () {
    $(document.body).addClass("keyboard");
    $(document.body).removeClass("menu");
  })
  .on("keydown", function () {
    $(document.body).addClass("keyboard");
  })
  .on("blur", "textarea, input", function () {
    //$(document.body).removeClass("keyboard");
  });
document
  .getElementById("action-accents")
  .addEventListener("click", function () {
    $(document.body).addClass("keyboard");
    $(document.body).removeClass("menu");
    clearActive();
    $(".accent-bar").removeClass("hide");
    let capsButton = document.getElementById("accent-caps");
    for (accent of document.getElementsByClassName("accent-button")) {
      accent.innerText = accent.innerText.toLowerCase();
    }
    capsButton.className = "";
  });
$("#answer-input").on("focus", function () {
  $(document.body).removeClass("menu");
  clearActive();
});
document.getElementById("accent-back").addEventListener("click", function () {
  $(".accent-bar").addClass("hide");
  document.getElementById("accent-caps").className = "";
});
document.getElementById("accent-caps").addEventListener("click", function () {
  let capsButton = document.getElementById("accent-caps");
  if (capsButton.className == "caps") {
    for (accent of document.getElementsByClassName("accent-button")) {
      accent.innerText = accent.innerText.toLowerCase();
    }
    capsButton.className = "";
  } else {
    for (accent of document.getElementsByClassName("accent-button")) {
      accent.innerText = accent.innerText.toUpperCase();
    }
    capsButton.className = "caps";
  }
});
for (accent of document.getElementsByClassName("accent-button")) {
  accent.addEventListener("click", (e) => {
    let target = e.target,
      input = document.getElementById("answer-input");
    input.value += target.innerText;
  });
}
//for the menus
function clearActive() {
  for (action of ["themes", "verbs", "score"]) {
    $("#action-" + action).removeClass("active");
  }
}
$("#action-themes").click(function () {
  if ($("#action-themes").hasClass("active")) {
    $(document.body).removeClass("menu");
    clearActive();
  } else {
    $(document.body).addClass("menu");
    clearActive();
    $("#action-themes").addClass("active");
    $(document.body).attr("menutype", "themes");
  }
});
$("#action-verbs").click(function () {
  if ($("#action-verbs").hasClass("active")) {
    $(document.body).removeClass("menu");
    clearActive();
  } else {
    $(document.body).addClass("menu");
    clearActive();
    $("#action-verbs").addClass("active");
    $(document.body).attr("menutype", "verbs");
  }
});
$("#action-score").click(function () {
  if ($("#action-score").hasClass("active")) {
    $(document.body).removeClass("menu");
    clearActive();
  } else {
    $(document.body).addClass("menu");
    clearActive();
    $("#action-score").addClass("active");
    $(document.body).attr("menutype", "score");
  }
});
