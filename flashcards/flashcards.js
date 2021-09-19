var timeout,
    verbs,
    questions = [],
    regularEnds = {
        "ir": {
            "Je": "is",
            "Tu": "is",
            "Il / Elle / On": "it",
            "Nous": "issons",
            "Vous": "issez",
            "Ils / Elles": "issent"
        },
        "re": {
            "Je": "s",
            "Tu": "s",
            "Il / Elle / On": "",
            "Nous": "ons",
            "Vous": "ez",
            "Ils / Elles": "ent"
        },
        "er": {
            "Je": "e",
            "Tu": "es",
            "Il / Elle / On": "e",
            "Nous": "ons",
            "Vous": "ez",
            "Ils / Elles": "ent"
        }
    },
    subjects = ['Je', 'Tu', 'Il / Elle / On', 'Nous', 'Vous', 'Ils / Elles'],
    intro = true
function random(max) {
    if (typeof (max) != 'number') {
        return max[parseInt(Math.random() * (max.length))]
    } else {
        return parseInt(Math.random() * max)
    }
}
class Conjugate {
    passeCompose(subject, verb) {
        let question = {},
            verbEle = verbs[verb];
        question.subject = subject.toLowerCase()
        question.verb = verb.toLowerCase()
        question.answer = ([verbs[verbEle.PC.helping][subject], verbEle.PC.participle].join(" ")).toLowerCase()
        //question.answer = [subject, question.answer].join(" ")
        return question
    }
    present(subject, verb) {
        let question = {}
        question.subject = subject.toLowerCase()
        question.verb = verb.toLowerCase()
        question.answer = (verbs[verb][subject]).toLowerCase()
        if ((verbs[verb]["All"] === "regular") || question.answer === "regular") {
            let regular = {}
            regular.ending = verb.substr(verb.length - 2)
            regular.base = verb.substr(0, verb.length - 2)
            question.answer = regular.base + regularEnds[regular.ending][subject]
        }
        //question.answer = [subject, question.answer].join(" ")
        return question
    }
}
conjugator = new Conjugate
function loadVerbs() {
    $.ajax({
        url: '../verbs.json',
        dataType: "json",
        success: r => {
            verbs = r
            //console.log(verbs)
        },
        error: function (err) {
            console.error("error: could not load verbs.json :(")
            console.log(err)
        }
    });
}

function finishIntro() {
    if (intro) {
        intro = false
        setTimeout(function () { document.body.className = "" }, 250)
    }
}
//cardControls
function shiftCard(num) {
    finishIntro()
    let flash = document.getElementById("flashcard-element")
    //setup element things
    try { window.clearTimeout(timeout) } catch { }
    flash.className = ""
    if (num > 0) {
        timeout = setTimeout(function () { flash.className = "next" }, 100)
    } else if (num < 0) {
        timeout = setTimeout(function () { flash.className = "prev" }, 100)
    }
    timeoutNew = window.setTimeout(function () {
        createCard()
    }, 250)
}
function createCard() {
    let cardData = {},
        verb = random(Object.keys(verbs)),
        subject = random(subjects),
        flashParts = {
            "subject": document.getElementById("question-subject"),
            "verb": document.getElementById("question-verb"),
            "answer": document.getElementById("question-answer"),
            "tense": document.getElementById("question-tense")
        }
    if (parseInt(Math.random() * 2) === 0) {
        cardData = conjugator.passeCompose(subject, verb)
        flashParts.tense.innerText = "(passé composé)"
    } else {
        cardData = conjugator.present(subject, verb)
        flashParts.tense.innerText = "(present)"
    }
    console.log(cardData)
    flashParts.subject.innerText = cardData.subject
    flashParts.verb.innerText = cardData.verb
    flashParts.answer.innerText = cardData.answer
}
function flipCard() {
    let flash = document.getElementById("flashcard-element")
    flash.className = ((flash.className === "flipped") ? "" : "flipped")
}
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
        console.log("left")
        shiftCard(-1)
    }
    else if (e.keyCode == '39') {
        console.log("right")
        shiftCard(1)
    } else if (e.keyCode == '13' || e.keyCode == '38' || e.keyCode == '40') {
        console.log("enter")
        flipCard()
    }
}
window.addEventListener("keydown", e => { checkKey(e) })
window.addEventListener("load", function () {
    document.getElementById("touch-flip").addEventListener("click", function () {
        flipCard()
    })
    document.getElementById("touch-swap-left").addEventListener("click", function () {
        shiftCard(-1)
    })
    document.getElementById("touch-swap-right").addEventListener("click", function () {
        shiftCard(1)
    })
    loadVerbs()
})