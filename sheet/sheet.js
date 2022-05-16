var verbs,
  regularEnds = {
    ir: {
      Je: "is",
      Tu: "is",
      "Il / Elle / On": "it",
      Nous: "issons",
      Vous: "issez",
      "Ils / Elles": "issent",
    },
    re: {
      Je: "s",
      Tu: "s",
      "Il / Elle / On": "",
      Nous: "ons",
      Vous: "ez",
      "Ils / Elles": "ent",
    },
    er: {
      Je: "e",
      Tu: "es",
      "Il / Elle / On": "e",
      Nous: "ons",
      Vous: "ez",
      "Ils / Elles": "ent",
    },
  },
  subjects = ["Je", "Tu", "Il / Elle / On", "Nous", "Vous", "Ils / Elles"];
function random(max) {
  if (typeof max != "number") {
    return max[parseInt(Math.random() * max.length)];
  } else {
    return parseInt(Math.random() * max);
  }
}
class Conjugate {
  passeCompose(subject, verb) {
    let question = {},
      verbEle = verbs[verb];
    question.subject = subject.toLowerCase();
    question.verb = verb.toLowerCase();
    question.answer = verbEle.PC.participle;
    if (verbEle.PC.participle === "regular") {
      let conjugation = {};
      conjugation.base = verb.substr(0, verb.length - 2);
      conjugation.ending = verb.substr(verb.length - 2, verb.length);
      if (conjugation.ending === "er") {
        conjugation.pcEnd = "é";
      } else if (conjugation.ending === "re") {
        conjugation.pcEnd = "u";
      } else if (conjugation.ending === "ir") {
        conjugation.pcEnd = "i";
      } else {
        window.alert(
          "errored while conjugating a verb marked as regular, but with no acceptable ending"
        );
      }
      question.answer = conjugation.base + conjugation.pcEnd;
    } else {
      question.answer = verbEle.PC.participle;
    }
    question.answer = [verbs[verbEle.PC.helping][subject], question.answer]
      .join(" ")
      .toLowerCase();
    question.tense = "(passé composé)";
    if (question.subject == "ils / elles") {
      question.subject = random(["ils", "elles"]);
    } else if (question.subject == "il / elle / on") {
      question.subject = random(["il", "elle", "on"]);
    }
    if (verbEle.PC.helping != "Avoir") {
      if (
        question.subject != "ils" &&
        question.subject != "il" &&
        question.subject != "on"
      ) {
        question.answer += "(e)";
      }
      if (question.subject.includes("elle")) {
        question.answer = question.answer.replace("(e)", "e");
      }
      if (
        question.subject == "ils" ||
        question.subject == "elles" ||
        question.subject == "nous"
      ) {
        question.answer += "s";
      } else if (question.subject == "vous") {
        question.answer += "(s)";
      }
    }

    //question.answer = [subject, question.answer].join(" ")
    return question;
  }
  présent(subject, verb) {
    let question = {};
    question.subject = subject.toLowerCase();
    question.verb = verb.toLowerCase();
    question.answer = verbs[verb][subject];
    question.tense = "(présent)";
    if (verbs[verb]["All"] === "regular" || question.answer === "regular") {
      let regular = {};
      regular.ending = verb.substr(verb.length - 2);
      regular.base = verb.substr(0, verb.length - 2);
      question.answer = regular.base + regularEnds[regular.ending][subject];
    }
    if (question.subject == "ils / elles") {
      question.subject = random(["ils", "elles"]);
    } else if (question.subject == "il / elle / on") {
      question.subject = random(["il", "elle", "on"]);
    }
    question.answer = question.answer.toLowerCase();
    //question.answer = [subject, question.answer].join(" ")
    return question;
  }
}
conjugator = new Conjugate();
function loadVerbs() {
  $.ajax({
    url: "../verbs.json",
    dataType: "json",
    success: (r) => {
      verbs = r;
      createQuestions();
    },
    error: function (err) {
      console.error("error: could not load verbs.json :(");
      console.log(err);
    },
  });
}
function CreatePDFfromHTML(showAnswers) {
  var HTML_Width = $(".html-content").width();
  var HTML_Height = $(".html-content").height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + top_left_margin * 2;
  var PDF_Height = HTML_Height + top_left_margin * 2;
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
  if (showAnswers) {
    document.body.className = "answers";
  }
  html2canvas($(".html-content")[0]).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      "JPG",
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height
    );
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height
      );
    }
    if (showAnswers) {
      pdf.save("VITE-WS-Answers.pdf");
    } else {
      pdf.save("VITE-Generated-WS.pdf");
    }
    document.body.className = "";
  });
}
$("#cmd").click(function () {
  CreatePDFfromHTML(false);
});
$("#full").click(function () {
  CreatePDFfromHTML(true);
});
function returnQuestion() {
  let verb = random(Object.keys(verbs)),
    subject = random(subjects);
  /*
  return parseInt(Math.random() * 2) === 0
    ? conjugator.passeCompose(subject, verb)
    : conjugator.présent(subject, verb);
    */
  return conjugator.passeCompose(subject, verb);
}
function createQuestions() {
  for (parent of $(".question-parent")) {
    let parts = {
      subject: parent.querySelector(".question-subject"),
      verb: parent.querySelector(".question-verb"),
      answer: parent.querySelector(".question-answer"),
    };
    question = returnQuestion();
    parts.subject.textContent = question.subject;
    parts.verb.textContent = question.verb;
    parts.answer.textContent = question.answer;
  }
}
window.addEventListener("load", function () {
  loadVerbs();
});
