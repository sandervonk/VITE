//*Set Question Data
/*

*/
var question = {},
  questionStart = new Date().getTime(),
  subjectDefinitions = {
    je: "I",
    tu: "You",
    il: "He",
    elle: "She",
    on: "One",
    nous: "We",
    vous: "You",
    ils: "They (masculine)",
    elles: "They (feminine)",
  },
  tenseDefinitions = {
    pr: "Present tense",
    pc: "Past tense",
    ps: "Past tense (literature)",
    im: "Imperfect past (past state or ongoing action)",
    fs: "Future tense (intentions, predictions, conditional)",
    fa: "Future tense (actions previous to another)",
    co: "Conditional tense",
    cp: "Past conditional tense (regrets, what would / could have happened)",
    su: "Subjunctive Tense (opinions, emotions, and possibilities)",
    sp: "Past of the Subjunctive Tense (opinions, emotions, and possibilities)",
  };
function showQuestion(q) {
  question = q;
  questionStart = new Date().getTime();
  $("#vite-q-verb, #vite-q-tense").addClass("notranslate");
  $("#vite-q-verb").text(q.verb);
  $("#vite-q-tense").text(q.tense);
  $("#vite-q-verb").attr("info", q.definition);
  $("#vite-q-subject").attr(
    "info",
    subjectDefinitions[q.subject.toLowerCase()]
  );
  if (
    q.tense.includes("Subjonctif") &&
    ["e", "i", "o"].includes(q.subject[0].toLowerCase())
  ) {
    $("#vite-q-prefix").html("qu'");
  } else if (q.tense.includes("Subjonctif")) {
    $("#vite-q-prefix").html("que&nbsp;");
  } else {
    $("#vite-q-prefix").html("");
  }
  $("#vite-q-tense").attr("info", tenseDefinitions[q.tenseShort]);
  $("#vite-q-subject").text(q.subject);
  // sizing
  if ($("#vite-q-prompt").outerHeight() > 28) {
    $("#vite-q-prompt").css({
      "margin-bottom": 45 + 28 - $("#vite-q-prompt").outerHeight(),
    });
  } else {
    $("#vite-q-prompt").css({ "margin-bottom": "" });
  }
  $("#vite-q-subject").addClass("notranslate");
  if (q.fullsize != undefined) {
    $("#answer-mascot").attr("mood", "full=" + q.fullsize);
  } else {
    $("#answer-mascot").attr("mood", "mood=" + q.mascot);
  }
}
function submitAnswer(skipped) {
  if (document.body.hasAttribute("showanswer")) {
    $(document.body).removeAttr("showanswer");
    $(document.body).removeAttr("avaliable");
    $(document.body).removeAttr("result");
    let amntDone =
      (scoringData.countAll == "all" ? score.total : score.correct) /
      scoringData.target;
    if (
      scoringData.target != NaN &&
      scoringData.countAll != null &&
      amntDone >= 1
    ) {
      $("form[name='practice-results']").submit();
    } else {
      showQuestion(new Question());
    }

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
    if (skipped == true) {
      $(document.body).attr("result", "skipped");
    }
  }
}

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
  constructor(options) {
    if (options == undefined || options == null) {
      this.#tense = this.pickTense();
      this.#subject = this.random(split("subjects"));
      this.#verb = this.random(split("verbs"));
    } else {
      console.log("tense:", options.tense);
      this.#tense = options.tense;
      this.#subject = options.subject;
      this.#verb = options.verb;
    }

    this.#verb = {
      name: this.#verb,
      verb: verbs[this.#verb],
    };
    return this.conjugate(this.#tense, this.#subject, this.#verb);
  }
  random(input) {
    if (typeof input == "object") {
      return input[parseInt(Math.random() * input.length)];
    } else if (typeof input == "number") {
      return parseInt(Math.random() * input);
    } else {
      return Math.random();
    }
  }
  pickTense() {
    return this.random(split("tenses"));
  }
  conjugate(t, s, v) {
    let tOriginal = t;
    if (v.name.includes("Conna")) {
      v.verb = verbs["Connaître"];
    }
    let a = {};
    switch (t) {
      case "pr":
        a = this.pcTense(s, v);
        t = "Présent";
        break;
      case "pc":
        a = this.pcTense(s, v);
        t = "Passé Composé";
        break;
      case "ps":
        a = this.psTense(s, v);
        t = "Passé Simple";
        break;
      case "im":
        a = this.imTense(s, v);
        t = "Imparfait";
        break;
      case "fs":
        a = this.fsTense(s, v);
        t = "Futur Simple";
        break;
      case "fa":
        a = this.faTense(s, v);
        t = "Futur Antérieur";
        break;
      case "co":
        a = this.coTense(s, v);
        t = "Conditionnel";
        break;
      case "cp":
        a = this.cpTense(s, v);
        t = "Conditionnel Passé";
        break;
      case "su":
        a = this.suTense(s, v);
        t = "Subjonctif";
        break;
      case "sp":
        a = this.spTense(s, v);
        t = "Subjonctif Passé";
        break;
      // case "pp":
      //   a = this.ppTense(s, v);
      //   t = "Plus que Parfait";
      //   break;
      default:
        console.error(`Could not match requested tense "${t}" to method`);
        return {
          subject: a.subject,
          verb: v.name,
          tense: "error: could not be matched",
          tenseShort: "error",
          answer: {
            alt: "error",
            full: "error",
          },
          definition: v.verb.definition,
          mascot: v.verb.mascot,
          fullsize: v.verb.fullsize,
        };
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
      mascot: v.verb.mascot,
      fullsize: v.verb.fullsize,
    };
  }
  compress(t) {
    for (let v of ["a", "e", "i", "o", "u", "y"]) {
      t = t.replace("je " + v, "j'" + v);
    }
    return t;
  }
  versions(answer, subjects, skipAgreement) {
    let answers = {
      alt: answer.toLowerCase(),
    };
    (answers.subject =
      skipAgreement == true ? subjects : this.agreement(subjects).subject),
      (answers.full = this.compress(
        [answers.subject, answers.alt].join(" ").toLowerCase()
      ));
    return answers;
  }
  prTense(s, v) {
    //Présent Tense Conjugator
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
      return { participle: a.participle, subject: a.subject };
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
    a.participle = this.pcTense(s, v, true).participle;
    a.full += (" " + a.participle).toLowerCase();
    a.alt += (" " + a.participle).toLowerCase();
    return a;
  }
  coTense(s, v, raw) {
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
    if (raw == true) {
      return { a: a, s: s };
    } else {
      return this.versions(a, s);
    }
  }
  cpTense(s, v) {
    //Conditionnel Passé Conjugator
    let a = {};
    a.coHelping = this.coTense(
      s,
      { name: v.verb.PC.helping, verb: verbs[v.verb.PC.helping] },
      true
    ).a;
    a.pc = this.pcTense(s, v, true);
    return this.versions(
      [a.coHelping, a.pc.participle].join(" "),
      a.pc.subject,
      true
    );
  }
  suTense(s, v, raw) {
    //Subjonctif Conjugator
    let end = {
        Je: "e",
        Tu: "es",
        "Il / Elle / On": "e",
        Nous: "ions",
        Vous: "iez",
        "Ils / Elles": "ent",
      },
      a,
      r;
    if (v.verb.SU == "regular" || v.verb.SU[s] == "regular") {
      r = this.prTense("Ils / Elles", v).alt;
      if (r.substr(r.length - 3, 3) == "ent") {
        r = r.substr(0, r.length - 3);
        a = r + end[s];
      } else {
        window.alert(
          `ERR: Could not remove -ent ending from présent tense of 'Ils / Elles' conjugation ('${r}'), cannot form Subjonctif`
        );
      }
    } else {
      a = v.verb.SU[s];
    }
    if (raw == true) {
      return { a: a, s: s };
    } else {
      return this.versions(a, s);
    }
  }
  spTense(s, v) {
    //Subjonctif Passé Conjugator
    let a = {};
    a.coHelping = this.suTense(
      s,
      { name: v.verb.PC.helping, verb: verbs[v.verb.PC.helping] },
      true
    ).a;
    a.pc = this.pcTense(s, v, true);
    return this.versions(
      [a.coHelping, a.pc.participle].join(" "),
      a.pc.subject,
      true
    );
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
