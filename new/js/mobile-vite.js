//*Set Question Data
/*
      t = "Present";
    } else if (t == "pc") {
      a = this.pcTense(s, v);
      t = "Passé Composé";
    } else if (t == "ps") {
      a = this.psTense(s, v);
      t = "Passé Simple";
    } else if (t == "im") {
      a = this.imTense(s, v);
      t = "Imparfait";
    } else if (t == "fs") {
      a = this.fsTense(s, v);
      t = "Futur Simple";
    } else if (t == "fa") {
      a = this.faTense(s, v);
      t = "Futur Antérieur";
    } else if (t == "co") {
      a = this.coTense(s, v);
      t = "Conditionnel";
*/
var question = {},
  questionStart = new Date().getTime(),
  subjectDefinitions = {
    je: "I",
    tu: "You",
    il: "He",
    elle: "She",
    nous: "We",
    vous: "You",
    ils: "They (masculine)",
    elles: "They (feminine)",
  },
  tenseDefinitions = {
    pr: "Present tense",
    pc: "Past tense",
    ps: "Past tense (literature)",
    im: "Past state or ongoing action",
    fs: "Future tense (intentions, predictions, conditional)",
    fa: "Future tense (actions previous to another)",
    co: "Conditional tense",
  };
function showQuestion(q) {
  question = q;
  questionStart = new Date().getTime();
  $("#vite-q-verb").text(q.verb);
  $("#vite-q-verb").attr("info", q.definition);
  $("#vite-q-verb").addClass("notranslate");
  $("#vite-q-tense").text(q.tense);
  $("#vite-q-tense").addClass("notranslate");
  $("#vite-q-tense").attr("info", tenseDefinitions[q.tenseShort]);
  $("#vite-q-subject").text(q.subject);
  $("#vite-q-subject").attr(
    "info",
    subjectDefinitions[q.subject.toLowerCase()]
  );
  $("#vite-q-subject").addClass("notranslate");
}
function submitAnswer() {
  if (document.body.hasAttribute("showanswer")) {
    $(document.body).removeAttr("showanswer");
    showQuestion(new Question());

    $("#answer-input").val("");
  } else {
    $(document.body).attr("showanswer", "");
    //Check answer
    let inputAnswer = $("#answer-input").val().toLowerCase();
    if (
      variations(question.answer.alt).includes(inputAnswer) ||
      variations(question.answer.full).includes(inputAnswer)
    ) {
      //?correct
      changeScore(1);
      $("#answer-correction-1").text("");
      $("#answer-correction-2").text("");
      $(document.body).attr("result", "correct");
    } else {
      //?incorrect
      changeScore(-1);
      $(document.body).attr("result", "incorrect");
      $("#answer-correction-1").text(question.answer.alt);
      $("#answer-correction-2").text(question.answer.full);
      $("#answer-correction-1").addClass("notranslate");
      $("#answer-correction-2").addClass("notranslate");
    }
  }
}
//Make the overlay closable
$("#answer-overlay, #action-next").click(function () {
  submitAnswer();
});
//*Answer Handling and Variations
function variations(answer) {
  return [
    answer.replace("(e)", ""),
    answer.replace("(s)", ""),
    answer.replace("(e)", "").replace("(s)", ""),
    answer.replace("(e)", "e"),
    answer.replace("(s)", "s"),
    answer.replace("(e)", "e").replace("(s)", "s"),
  ];
}
//*Setup Questions
class Question {
  #tense;
  #verb;
  #subject;
  constructor() {
    this.#tense = this.pickTense();
    this.#subject = this.random(split(localStorage["vite-subjects"]));
    this.#verb = this.random(split(localStorage["vite-verbs"]));
    this.#verb = {
      name: this.#verb,
      verb: verbs[this.#verb],
    };
    return this.conjugate(this.#tense, this.#subject, this.#verb);
  }
  random(input) {
    if (typeof input == "object") {
      return input[parseInt(Math.random() * input.length)];
    } else if (typeof input == number) {
      return parseInt(Math.random() * input);
    } else {
      return Math.random();
    }
  }
  pickTense() {
    let tenses = [],
      tense;
    for (tense of ["pr", "pc", "ps", "im", "fs", "fa", "co"]) {
      if (JSON.parse(localStorage["vite-" + tense])) {
        tenses.push(tense);
      }
    }
    return this.random(tenses);
  }
  conjugate(t, s, v) {
    let tOriginal = t;
    if (v.name.includes("Conna")) {
      v.verb = verbs["Connaître"];
    }
    let a = {};
    if (t == "pr") {
      a = this.prTense(s, v);
      t = "Present";
    } else if (t == "pc") {
      a = this.pcTense(s, v);
      t = "Passé Composé";
    } else if (t == "ps") {
      a = this.psTense(s, v);
      t = "Passé Simple";
    } else if (t == "im") {
      a = this.imTense(s, v);
      t = "Imparfait";
    } else if (t == "fs") {
      a = this.fsTense(s, v);
      t = "Futur Simple";
    } else if (t == "fa") {
      a = this.faTense(s, v);
      t = "Futur Antérieur";
    } else if (t == "co") {
      a = this.coTense(s, v);
      t = "Conditionnel";
    }
    return {
      subject: a.subject,
      verb: v.name,
      tense: t,
      tenseShort: tOriginal,
      answer: {
        alt: a.alt,
        full: a.full,
      },
      definition: v.verb.definition,
    };
  }
  compress(t) {
    for (let v of ["a", "e", "i", "o", "u", "y"]) {
      t = t.replace("je " + v, "j'" + v);
    }
    return t;
  }
  versions(answer, subjects) {
    let answers = {
      subject: this.agreement(subjects).subject,
      alt: answer.toLowerCase(),
    };
    answers.full = this.compress(
      [answers.subject, answers.alt].join(" ").toLowerCase()
    );
    return answers;
  }
  prTense(s, v) {
    //Present Tense Conjugator
    let end = {
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
      a;

    a = v.verb[s];

    if (a == "regular" || v.verb.All == "regular") {
      //regular verb conjugations
      let b = v.name.substr(0, v.name.length - 2),
        e = v.name.substr(-2);
      if (Object.keys(end).includes(e)) {
        a = b + end[e][s];
      } else {
        window.alert(
          "ERR: Cannot find regular ending for verb with non-ir/er/re ending marked as regular"
        );
      }
    }
    return this.versions(a, s);
  }
  psTense(s, v) {
    //Passé Simple Conjugator
    let irReEnd = {
        Je: "is",
        Tu: "is",
        "Il / Elle / On": "it",
        Nous: "îmes",
        Vous: "îtes",
        "Ils / Elles": "irent",
      },
      erEnd = {
        Je: "ai",
        Tu: "as",
        "Il / Elle / On": "a",
        Nous: "âmes",
        Vous: "âtes",
        "Ils / Elles": "èrent",
      },
      a,
      r = v.name.substr(0, v.name.length - 2);
    if (v.verb.PS.All == "regular") {
      if (v.name.substr(-2) == "er") {
        a = r + erEnd[s];
      } else if (v.name.substr(-2) == "ir" || v.name.substr(-2) == "re") {
        a = r + irReEnd[s];
      }
    } else {
      a = v.verb.PS[s];
    }
    return this.versions(a, s);
  }
  pcTense(s, v) {
    //Passé Composé Conjugator
    let a = {
      helping: verbs[v.verb.PC.helping][s],
    };
    //get participle
    if (v.verb.PC.participle === "regular") {
      a.base = v.name.substr(0, v.name.length - 2);
      a.end = v.name.substr(-2);
      if (a.end === "er") {
        a.end = "é";
      } else if (a.end === "re") {
        a.end = "u";
      } else if (a.end === "ir") {
        a.end = "i";
      } else {
        window.alert(
          "errored while conjugating a verb marked as regular, but with no acceptable ending"
        );
      }
      a.participle = a.base + a.end;
    } else {
      a.participle = v.verb.PC.participle;
    }
    a.agreement = this.agreement(s);
    a.subject = a.agreement.subject;
    if (v.verb.PC.helping == "Avoir") {
      a.answer = [a.helping, a.participle].join(" ").toLowerCase();
    } else {
      a.participle = a.participle + a.agreement.agreement;
      a.answer = [a.helping, a.participle].join(" ").toLowerCase();
    }
    if (arguments[2] == true) {
      return a.participle;
    } else {
      return this.versions(a.answer, s);
    }
  }
  imTense(s, v) {
    //Imparfait Conjugator
    let end = {
        Je: "ais",
        Tu: "ais",
        "Il / Elle / On": "ait",
        Nous: "ions",
        Vous: "iez",
        "Ils / Elles": "aient",
      },
      a;
    if (v.name == "Être") {
      a = "ét" + end[s];
    } else {
      a = this.prTense("Nous", v).alt;
      a = a.substr(0, a.length - 3) + end[s];
    }
    return this.versions(a, s);
  }
  fsTense(s, v) {
    //Futur Simple Conjugator
    let end = {
        Je: "ai",
        Tu: "as",
        "Il / Elle / On": "a",
        Nous: "ons",
        Vous: "ez",
        "Ils / Elles": "ont",
      },
      r = v.verb.FS == "regular" ? v.name : v.verb.FS;
    //re verb rules
    if (r.substr(-2) == "re") {
      r = r.substr(0, r.length - 1);
    }
    let a = [r, end[s]].join("").toLowerCase();
    return this.versions(a, s);
  }
  faTense(s, v) {
    //Futur Antérieur Conjugator
    let a = this.fsTense(s, {
      name: v.verb.PC.helping,
      verb: verbs[v.verb.PC.helping],
    });
    a.participle = this.pcTense(s, v, true);
    a.full += (" " + a.participle).toLowerCase();
    a.alt += (" " + a.participle).toLowerCase();
    return a;
  }
  coTense(s, v) {
    //Conditionnel Conjugator
    let end = {
      Je: "ais",
      Tu: "ais",
      "Il / Elle / On": "ait",
      Nous: "ions",
      Vous: "iez",
      "Ils / Elles": "aient",
    };

    let r = v.verb.FS == "regular" ? v.name : v.verb.FS;
    if (r.substr(r.length - 2, 2) == "re") {
      r = r.substr(0, r.length - 1);
    }
    let a = (r + end[s]).toLowerCase();
    return this.versions(a, s);
  }
  agreement(subjects) {
    let data = {
      agreement: "",
    };
    //pick subject
    data.subject = this.random(subjects.toLowerCase().split(" / "));
    if (["elle", "elles"].includes(data.subject)) {
      data.agreement += "e";
    } else if (!["il", "ils"].includes(data.subject)) {
      data.agreement += "(e)";
    }
    if (["ils", "elles", "nous"].includes(data.subject)) {
      data.agreement += "s";
    } else if (data.subject == "vous") {
      data.agreement += "(s)";
    }
    return data;
  }
}
//*Buttons & Actions
/*
function refreshEvents() {
  $(".subject-button, .tense-button, .verb-button").click(function () {
    //New Question
    showQuestion(new Question());
  });
}
*/
