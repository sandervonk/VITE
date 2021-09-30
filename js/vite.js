//some json for reflexives 
/*
  "verb": {
    "definition": "to _",
    "PC": {
      "helping": "Être",
      "participle": "regular"
    },
    "All": "regular"
  },
  "verb": {
    "definition": "to _",
    "PC": {
      "helping": "Être",
      "participle": "regular"
    },
    "Je": "",
    "Tu": "",
    "Il / Elle / On": "",
    "Nous": "",
    "Vous": "",
    "Ils / Elles": ""
  }
*/
var timed = false,
    timedID,
    countdown,
    timerStart,
    time = 2000,
    problemTime = {
        "max-perfect": 2,
        "allotted": 10,
        "max-score": 1000,
        "score": 0,
        "problems": 0,
        "incorrect-deduction": 100
    },
    reflexive = {
        "Je": "me",
        "Tu": "te",
        "Il / Elle / On": "se",
        "Nous": "nous",
        "Vous": "vous",
        "Ils / Elles": "se"
    },
    regularEnd = {
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
    }
function twoPlaces(value) {
    let num = parseInt(value * 100) / 100
    num = num.toFixed(2)
    return num
}
function resetCustom() {
    localStorage["vite-custom-verbs"] = ""
    localStorage["vite-verbs"] = 'Venir,Pouvoir,Prendre,Connaitre,Savoir,Avoir,Être,Aller,Faire,Manger,Finir'
    window.location.reload()
}
function checkTouch() {
}
function sendMessage(head, content, foot) {
    head += "\n\n----- JSON Start -----"
    foot = "----- JSON End -----\n\n" + foot
    if (content.includes("undefined")) {
        window.alert("looks like something's wrong with your JSON, please try checking the console, and/or make sure you have some custom verbs added below!")
    } else if (content === "{}") {
        window.alert("You don't seem to have any custom verbs, try adding some then trying again!")
    } else {
        let link = `mailto:100026480@mvla.net?subject=My%20Custom%20VITE%20Verbs&body=${encodeURIComponent(head + "\n" + content + "\n" + foot)}`
        if (link.length >= 2000) {
            window.alert("sorry, the MAILTO: function only supports messages of up to 2000 characters, so this link will probably not work. Try right-clicking the Share button and copying the JSON on the next page instead!")
            window.open(`http://sandervonk.github.io/dev/rawviewer.html?${encodeURIComponent(JSON.stringify(JSON.parse("{" + localStorage["vite-custom-verbs"] + "}"), null, "\t"))}`, "_blank")
        }
        window.location.href = link
    }

}
function addVerb() {
    let finished = true
    for (inputElement of document.querySelectorAll("#verb-add input, #verb-add submit")) {
        inputElement.className = inputElement.className.replace(" attention", "")
        if (inputElement.value === "") {
            finished = false
            inputElement.className += " attention"
        }
    }
    if (!finished) {
        window.alert("Looks like some fields still need to be filled out. Try doing so and submitting it again!")
    } else {
        let newVerb = {
            "PC": {
                "helping": document.getElementById("verb-add-helping").value,
                "participle": document.getElementById("verb-add-participle").value
            },
            "custom": true,
            "Je": document.getElementById("verb-add-subject-1").value,
            "Tu": document.getElementById("verb-add-subject-2").value,
            "Il / Elle / On": document.getElementById("verb-add-subject-3").value,
            "Nous": document.getElementById("verb-add-subject-4").value,
            "Vous": document.getElementById("verb-add-subject-5").value,
            "Ils / Elles": document.getElementById("verb-add-subject-6").value,
        }
        console.log(newVerb)
        newVerb = JSON.stringify(newVerb)
        newVerb = `"` + document.getElementById("verb-add-name").value + `"` + ": " + newVerb
        console.log(newVerb)
        localStorage["vite-custom-verbs"] += ((localStorage["vite-custom-verbs"].length > 0) ? "," : "") + newVerb
        window.location.reload()
    }
}
function toggleVerb(event, isMenu) {
    if (arguments.length != 2) {
        console.log("1 argument")
        isMenu = false
    } else {
        isMenu = true
    }
    let element = event.target
    let verbStorage = localStorage["vite-verbs"]
    if (verbStorage[0] === ",") {
        verbStorage = verbStorage.substr(1, verbStorage.length - 1)
    }
    if (verbStorage[verbStorage.length - 1] === ",") {
        verbStorage = verbStorage.substr(0, verbStorage.length - 1)
    }
    verbStorage = verbStorage.split(",")
    if (isMenu === true) {
        try {
            document.querySelector(`.menu-verb[name='${element.name}']`).className = document.querySelector(`.menu-verb[name='${element.name}']`).className.replace(" active", "")
        } catch { }
    }
    if (element.className.includes(" active")) {
        element.className = element.className.replace(" active", "")
        delete verbStorage[verbStorage.indexOf(element.textContent)]
    } else {
        element.className += " active"
        try {
            document.querySelector(`.menu-verb[name='${element.name}']`).className += " active"
        } catch { }
        if (!verbStorage.includes(element.textContent)) {
            verbStorage.push(element.textContent)
        }
    }
    verbStorage = (verbStorage.join(",")).replace(",,", ",")
    if (verbStorage[0] === ",") {
        verbStorage = verbStorage.substr(1, verbStorage.length - 1)
    }
    if (verbStorage[verbStorage.length - 1] === ",") {
        verbStorage = verbStorage.substr(0, verbStorage.length - 1)
    }
    localStorage["vite-verbs"] = verbStorage
    createProblem(verbs)
}
function verbOptions() {
    document.getElementById("verb-cover").style.display = "block"
    document.getElementById("verb-cover").addEventListener("click", event => {
        if (event.target.id === "verb-cover") {
            document.getElementById("verb-cover").style.display = ""
        }
    })
    document.getElementById("verb-options").innerHTML = ""
    for (verb of Object.keys(verbs)) {
        let activeVerb = localStorage["vite-verbs"].split(",").includes(verb)
        let isCustom = (verbs[verb].custom === true)
        document.getElementById("verb-options").innerHTML += `<button class="toggle-button ${isCustom ? "custom-verb " : ""}verb-button${activeVerb ? " active" : ""}" title="Toggle '${verb}' as a verb in problems." name="${verb}">${verb}</button>`
    }
    let verbElements = document.querySelectorAll("#verb-options button.verb-button")
    for (verbElement of verbElements) {
        verbElement.addEventListener("click", event => {
            toggleVerb(event, true)
        })
    }
}
//timed stuff
function startTimed() {
    if (document.getElementById("timed-time") != null) {
        if (JSON.stringify(parseInt(document.getElementById("timed-time").value)) != "null") {

            time = parseInt(document.getElementById("timed-time").value * 1000)
        }
    } else { console.log("could not find input") }
    timeleft = (time / 1000).toFixed(2)
    document.getElementById("timer-countdown").textContent = timeleft
    timedID = window.setTimeout(timedFunction, time)
    timerStart = (new Date()).getTime()
    document.getElementById("timer-countdown").className = "running"
    countdown = setInterval(function () {
        let timerNow = new Date()
        timerNow = timerNow.getTime()
        timeDiff = timerNow - timerStart
        timeDiff = (timeDiff / 1000)
        document.getElementById("timer-countdown").textContent = ((time / 1000) - timeDiff).toFixed(2)
        if ((time / 1000) <= timeDiff) {
            clearTimedFunction()
        }
    }, 10)
}
function timedFunction() {
    clearTimedFunction()

    //force submit
    if (document.getElementById("question-cover").style.display != "none") {
        //clearPrevious()
        //createProblem()
        //startTimed()
    } else {
        submitAnswer()
    }
}
function clearTimedFunction() {
    try {
        document.getElementById("timer-countdown").textContent = (0).toFixed(2)
        document.getElementById("timer-countdown").className = "stopped"
    } catch { console.log("failed setting info for countdown") }
    try { window.clearInterval(countdown) } catch (err) { console.error("got err:", err, "when clearing interval for countdown") }
    try { window.clearTimeout(timedID) } catch (err) { console.error("got err:", err, "when clearing timeout") }

}
//
function clearPrevious() {
    document.getElementById("question-cover").style.display = "none"
    document.getElementById("question-cover").textContent = ""
    document.getElementById("question-cover").title = ""
    document.getElementById("question-cover").className = "check"
    document.getElementById("question-answer-input").value = ""
}
//make things like "je ai" "j'ai" as needed
function compress(subject, conjugation) {
    let composite = "",
        newSubject = ""
    if (subject[subject.length - 1] === "e" && isVowel(conjugation[0])) {
        newSubject = subject.substr(0, subject.length - 1) + "'"
        composite = (newSubject + conjugation).toLowerCase()
    } else {
        composite = [subject, conjugation].join(" ")
    }
    return composite

}
//randomize tense
function pickTense() {
    let newTense = ""
    try {

        let passeStorage = JSON.parse(localStorage["vite-pc"]),
            presentStorage = JSON.parse(localStorage["vite-pr"])
        if (passeStorage && presentStorage) {
            newTense = (parseInt(Math.random() * 2) === 0) ? "pc" : "pr"
        } else if (presentStorage) {
            newTense = "pr"
        } else {
            newTense = "pc"
        }
    } catch {
        localStorage["vite-pc"] = true
        localStorage["vite-pr"] = true
        window.location.reload()
        newTense = "pr"
        console.error("faulty tense")
    }
    return newTense
}
//Present handler
function presentTense(verb, subject) {
    let answer = ""
    answer = verbs[verb][subject]
    if (answer === "regular" || verbs[verb]["All"] === "regular") {
        let base = verb.substr(0, verb.length - 2)
        let ending = verb.substr(verb.length - 2, verb.length - 1)
        if (Object.keys(regularEnd).includes(ending)) {
            answer = base + regularEnd[ending][subject]
        } else {
            window.alert("ERR: Cannot find regular ending for verb with non-ir/er/re ending marked as regular")
        }
    }
    return answer.toLowerCase()
}
//Reflexive handler
function reflexiveTense(verb, subject) {
    let answer = ""
    //answer = [subject, compress(compress(reflexive[subject], presentTense("Être", subject)), presentTense(verb, subject))].join(" ")
    answer = [subject, compress(reflexive[subject], presentTense(verb, subject))].join("")
    return answer.toLowerCase()
}
//PC handler
function passeComposeTense(verb, name, subject) {
    let conjugation = {}
    conjugation.subject = subject
    conjugation.helping = verbs[verb.PC.helping][subject]
    if (verb.PC.participle === "regular") {
        conjugation.base = name.substr(0, name.length - 2)
        conjugation.ending = name.substr(name.length - 2, name.length)
        if (conjugation.ending === "er") {
            conjugation.pcEnd = "é"
        } else if (conjugation.ending === "re") {
            conjugation.pcEnd = "u"
        } else if (conjugation.ending === "ir") {
            conjugation.pcEnd = "i"
        } else {
            window.alert("errored while conjugating a verb marked as regular, but with no acceptable ending")
        }
        conjugation.participle = conjugation.base + conjugation.pcEnd
    } else {
        conjugation.participle = verb.PC.participle
    }
    if ((subject === "Nous" || subject === "Vous" || subject === "Ils / Elles") && verb.PC.helping === "Être") {
        conjugation.participle += "s"
    }
    conjugation.full = ([conjugation.subject, conjugation.helping, conjugation.participle].join(" ")).toLowerCase()
    conjugation.full = conjugation.full.replace("je a", "j'a")
    conjugation.alt = ([conjugation.helping, conjugation.participle].join(" ")).toLowerCase()
    return conjugation
}

//answer handler
function resetTrackers() {
    localStorage["VITE-correct"] = 0
    localStorage["VITE-incorrect"] = 0
    document.getElementById("stats-correct").style.width = `50%`
    document.getElementById("stats-correct-label").title = "0 Correct"
    document.getElementById("stats-incorrect-label").title = "0 Incorrect"
    problemTime.problems = 0
    problemTime.score = 0
    document.getElementById("score-amount").textContent = 0
}
function isVowel(ch) {
    return (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u')
}
var correctAnswer = ""
var altAnswer = ""
var skipBlank = JSON.parse(localStorage["vite-skip-blank"])
function showAnswer(input) {

    let coverEle = document.getElementById("question-cover")
    if (input.toLowerCase() === correctAnswer.toLowerCase() || input.toLowerCase() === altAnswer.toLowerCase()) {
        coverEle.className = "check correct"
        localStorage["VITE-correct"] = parseInt(localStorage["VITE-correct"]) + 1
        coverEle.style.display = ""
        let score = 1000
        problemTime.end = (new Date).getTime()
        problemTime.duration = (problemTime.end - problemTime.start) / 1000
        score = ((problemTime.allotted - Math.max((problemTime.duration - problemTime["max-perfect"]), 0)) / problemTime.allotted)
        score = parseInt(score * problemTime["max-score"])
        score = Math.max(score, 0)
        problemTime.score += score
        document.getElementById("score-amount").textContent = problemTime.score
        problemTime.problems += 1
        console.log("score", score)
        console.log("total-score", problemTime.score)
        document.getElementById("question-answer-input").value = ""
    } else {
        problemTime.score -= (problemTime["incorrect-deduction"])
        problemTime.score = Math.max(problemTime.score, 0)
        document.getElementById("score-amount").textContent = problemTime.score
        problemTime.problems += 1
        console.log("score -", problemTime["incorrect-deduction"])
        console.log("total-score", problemTime.score)
        coverEle.className = "check incorrect"
        coverEle.style.display = ""
        localStorage["VITE-incorrect"] = parseInt(localStorage["VITE-incorrect"]) + 1
        document.getElementById("question-cover").textContent = correctAnswer + " or " + altAnswer.toLowerCase()
    }
    document.getElementById("stats-correct").style.width = `${100 * parseInt(localStorage["VITE-correct"]) / (parseInt(localStorage["VITE-correct"]) + parseInt(localStorage["VITE-incorrect"]))}%`
    document.getElementById("stats-correct").title = `${parseInt(localStorage["VITE-correct"])} Correct`
    document.getElementById("stats-parent").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`
    document.getElementById("stats-correct-label").title = `${parseInt(localStorage["VITE-correct"])} Correct`
    document.getElementById("stats-incorrect-label").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`
    //setup the needed things to make it go away

}
//setup verb sidebar
function setupVerbs(verbs) {
    let verbNames = Object.keys(verbs)
    if (verbNames.length > 6) {
        for (verb of [verbNames[0], verbNames[1], verbNames[2], verbNames[3], verbNames[4]]) {
            let activeVerb = localStorage["vite-verbs"].split(",").includes(verb)
            document.getElementById("table-verbs").innerHTML += `<button class="toggle-button menu-verb verb-button${activeVerb ? " active" : ""}" title="Toggle '${verb}' as a verb in problems." name="${verb}">${verb}</button>`
        }
        document.getElementById("table-verbs").innerHTML += `<button id="more-verbs" class="toggle-button" title="Select More Verbs">+ ${verbNames.length - 5} More</button>`
        document.getElementById("more-verbs").addEventListener("click", verbOptions)
    } else {
        for (verb of verbNames) {
            let activeVerb = localStorage["vite-verbs"].split(",").includes(verb)
            document.getElementById("table-verbs").innerHTML += `<button class="toggle-button menu-verb verb-button${activeVerb ? " active" : ""}" title="Toggle '${verb}' as a verb in problems." name="${verb}">${verb}</button>`
        }
    }

    for (verbToggle of document.querySelectorAll("#table-verbs button.verb-button")) {
        verbToggle.addEventListener("click", event => {
            toggleVerb(event)
        })
    }



    document.getElementById("custom-button").addEventListener("click", function () {
        window.alert("Sorry, that feature isn't avalible yet :(")
    })
}
//function to handle answer
function submitAnswer() {
    let answerElement = document.getElementById("question-answer-input")
    if (answerElement.value === "" && skipBlank) {
        createProblem()
    } else {

        showAnswer(answerElement.value)
    }
}
//function to form a new problem randomly
function createProblem(verbsIn) {
    clearTimedFunction()
    problemTime.start = (new Date).getTime()
    let questionSubjectElement = document.getElementById("question-subject-span"),
        questionVerbElement = document.getElementById("question-verb-span")
    if (arguments.length < 1) {
        verbsIn = verbs
    }
    let questionData = returnProblem(verbsIn)
    if (questionData != "no-verbs" && questionData != "no-subjects") {
        correctAnswer = questionData.answer
        correctWithSubject = questionData
        questionSubjectElement.innerText = questionData.subject
        questionVerbElement.innerText = questionData.verb
        let questionDataMod = questionData
        questionDataMod.answer = "Nice Try"
    } else {

    }

}
function returnProblem(verbs) {
    let activeSubjects = []
    let fullAnswer = {}
    let pickedTense = ""
    for (activeSubject of document.querySelectorAll("#table-subjects button.active")) {
        activeSubjects.push(activeSubject.innerText)
    }
    localStorage["vite-subjects"] = activeSubjects
    if (activeSubjects.length <= 0) {
        window.alert("Make sure you have some subjects enabled!")
        return "no-subjects"
    }
    let activeVerbs = []
    for (activeVerb of localStorage["vite-verbs"].split(",")) {
        activeVerbs.push(activeVerb)
    }
    console.log(activeVerbs)
    if (activeVerbs.length <= 0) {
        window.alert("Make sure you have some verbs enabled!")
        return "no-verbs"
    }
    let question = {},
        ranS = parseInt(Math.random() * (activeSubjects.length - 1)),
        ranV = parseInt(Math.random() * (activeVerbs.length - 1)),
        verbParent = verbs[activeVerbs[ranV]]
    question.subject = activeSubjects[ranS]
    question.verb = activeVerbs[ranV]
    //for PC
    pickedTense = pickTense()
    if (pickedTense === "pc") {
        fullAnswer = passeComposeTense(verbParent, question.verb, question.subject)
        question.answer = fullAnswer.alt
        altAnswer = fullAnswer.full
        question.verb += " (PC)"
    } else if (pickedTense === "pr") {
        question.answer = presentTense(question.verb, question.subject)
        altAnswer = compress(question.subject, question.answer)
    } else {
        window.alert("something went wrong while randomly picking a tense!")
    }
    return question
}
var verbs = {}
var subjects = localStorage["vite-subjects"].split(",")
window.addEventListener("load", function () {
    checkTouch()
    document.getElementById("verb-add-submit").addEventListener("click", function () {
        addVerb()
    })
    document.getElementById("verb-add-reset").addEventListener("click", resetCustom)
    document.getElementById("verb-custom-share").addEventListener("click", function () {
        sendMessage("Check out my custom VITE! verbs:", JSON.stringify(JSON.parse("{" + localStorage["vite-custom-verbs"] + "}"), null, "\t"), "Best,\nMe")
    })
    document.getElementById("verb-custom-share").addEventListener("contextmenu", function () {
        window.open(`http://sandervonk.github.io/dev/rawviewer.html?${encodeURIComponent(JSON.stringify(JSON.parse("{" + localStorage["vite-custom-verbs"] + "}"), null, "\t"))}`, "_blank")
    })
    document.getElementById("stats-reset").addEventListener("click", resetTrackers)
    document.getElementById("timed-time").addEventListener("input", function () {
        document.getElementById("timer-countdown").textContent = twoPlaces(document.getElementById("timed-time").value)
        clearPrevious()
        createProblem()
        clearTimedFunction()
        startTimed()
    })
    document.getElementById("maxwell-mode").addEventListener("click", function () {
        if (!(document.getElementById("maxwell-mode").className === "activated")) {
            timed = true
            document.getElementById("timer-parent").className = "activated"
            startTimed()
        } else {
            console.log("already activated!")
        }

    })
    document.getElementById("question-cover").addEventListener("click", function () {
        if (!document.getElementById("question-cover").className.includes("correct")) {
            document.getElementById("question-cover").style.display = "none"
            document.getElementById("question-cover").title = ""
            document.getElementById("question-cover").className = "check"
            createProblem()
        }


    })
    document.addEventListener("keydown", event => { checkKey(event) })

    function checkKey(e) {
        e = e || window.event;
        if (document.getElementById("question-cover").style.display != "none") {
            clearPrevious()
            createProblem()
            if (timed) {
                startTimed()
            }
        } else {
            if (e.keyCode == '38') {
                // up arrow
            }
            else if (e.keyCode == '40') {
                // down arrow
                createProblem()
            }
            else if (e.keyCode == '37') {
                // left arrow
            }
            else if (e.keyCode == '39') {
                // right arrow
                //createProblem()
            }
            else if (e.keyCode == '13') {
                if (timed) {
                    clearTimedFunction()
                }
                //enter key
                if (document.getElementById("question-cover").style.display != "none") {
                    //PROBLEMS HERE
                    clearPrevious()
                    createProblem()
                } else {
                    submitAnswer()
                }


            }


        }

    }
    //load JSON

    //setup subject hightlighting
    for (subjectTag of localStorage["vite-subjects"].split(",")) {
        let subject = document.querySelector(`button[name="${subjectTag}"]`)
        subject.className = subject.className += " active"
    }
    $.ajax({
        url: './verbs.json',
        dataType: "json",
        success: response => {
            verbs = response
            if (localStorage["vite-custom-verbs"] != "") {
                verbs = JSON.parse(JSON.stringify(verbs).substr(0, JSON.stringify(verbs).length - 1) + ", " + localStorage["vite-custom-verbs"] + "}")
            }
            setupVerbs(verbs)
            //console.log(verbs)
        },
        error: function (err) {
            console.error("error: could not load verbs.json :(")
            console.log(err)
        }
    });
    //listener
    for (toggle of document.querySelectorAll("#table-subjects button")) {
        toggle.addEventListener("click", function () {
            createProblem(verbs)
        })
    }


})