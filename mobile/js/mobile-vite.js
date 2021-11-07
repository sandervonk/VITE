//*Setup Questions
class Question {
  #tense;
  #verb;
  #subject;
  constructor() {
    this.#tense = this.pickTense();
    this.#subject = this.random(localStorage["vite-subjects"].split(","));
    this.#verb = this.random(localStorage["vite-verbs"].split(","));
    this.#verb = {
      name: this.#verb,
      verb: verbs[this.#verb],
    };
    this.conjugate(this.#tense, this.#subject, this.#verb);
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
    for (tense of ["pr", "pc", "im", "fs", "fa", "co"]) {
      if (JSON.parse(localStorage["vite-" + tense])) {
        tenses.push(tense);
      }
    }
    return this.random(tenses);
  }
  conjugate(t, s, v) {
    console.log([tense, subject, verb]);
    answer = {};
    if (t == "pr") {
      answer = this.prTense(s, v);
    } else if (t == "pc") {
      answer = this.pcTense(s, v);
    } else if (t == "im") {
      answer = this.imTense(s, v);
    } else if (t == "fs") {
      answer = this.fsTense(s, v);
    } else if (t == "fa") {
      answer = this.faTense(s, v);
    } else if (t == "co") {
      answer = this.coTense(s, v);
    }
    return answer;
  }
  prTense(s, v) {
    //Present Tense Conjugator
  }
  pcTense(s, v) {
    //Passé Composé Conjugator
  }
  imTense(s, v) {
    //Imparfait Conjugator
  }
  fsTense(s, v) {
    //Futur Simple Conjugator
  }
  faTense(s, v) {
    //Futur Antérieur Conjugator
  }
  coTense(s, v) {
    //Conditionnel Conjugator
  }
  agreement(subjects) {
    let data = {};
    //pick subject
    data.subject = this.random(subjects.toLowerCase().split(" / "));
    return data;
  }
}
thing = new Question();
//*Buttons & Actions
$(".verb-button, .subject-button, .tense-button").click(function () {
  //New Question
});
$(document.body).on("keypress", (e) => {
  if (e.which == 13) {
    //Submit Question
  }
});
$("#answer-submit").click(function () {
  //Submit Question
});
