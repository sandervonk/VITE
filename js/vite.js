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
    console.log(newTense)
    return newTense
}
//PC handler
function passeComposeTense(verb, name, subject) {
    console.log("arguments:")
    console.log(arguments)
    let conjugation = {}
    conjugation.subject = subject
    conjugation.helping = verbs[verb.PC.helping][subject]
    if (verb.PC.participle === "regular") {
        conjugation.base = verb.name.substr(0, name.length - 2)
        conjugation.ending = verb.name.substr(name.length - 2, name.length)
        if (conjugation.ending = "er") {
            conjugation.pcEnd = "é"
        } else if (conjugation.ending = "re") {
            conjugation.pcEnd = "u"
        } else if (conjugation.ending = "ir") {
            conjugation.pcEnd = "i"
        } else {
            window.alert("errored while conjugating a verb marked as regular, but with no acceptable ending")
        }
        conjugation.participle = conjugation.base + conjugation.pcEnd
    } else {
        conjugation.participle = verb.PC.participle
    }
    conjugation.full = ([conjugation.subject, conjugation.helping, conjugation.participle].join(" ")).toLowerCase()
    conjugation.alt = ([conjugation.helping, conjugation.participle].join(" ")).toLowerCase()
    console.log("PC conjugation:")
    console.log(conjugation)
    return conjugation
}

//answer handler
function resetTrackers() {
    localStorage["VITE-correct"] = 0
    localStorage["VITE-incorrect"] = 0
    document.getElementById("stats-correct").style.width = `50%`
    document.getElementById("stats-correct-label").title = "0 Correct"
    document.getElementById("stats-incorrect-label").title = "0 Incorrect"
}
function isVowel(ch) {
    return (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u')
}
var correctAnswer = ""
var altAnswer = ""
var skipBlank = JSON.parse(localStorage["vite-skip-blank"])
function showAnswer(input) {
    document.getElementById("question-answer-input").value = ""
    let coverEle = document.getElementById("question-cover")
    console.log("running showAnswer on:", input.toLowerCase())
    if (input.toLowerCase() === correctAnswer || input.toLowerCase() === altAnswer) {
        coverEle.className = "check correct"
        localStorage["VITE-correct"] = parseInt(localStorage["VITE-correct"]) + 1
        coverEle.style.display = ""
        console.log("correct, set classname")
    } else {
        coverEle.className = "check incorrect"
        coverEle.style.display = ""
        localStorage["VITE-incorrect"] = parseInt(localStorage["VITE-incorrect"]) + 1
        console.log("incorrect, set classname")
        document.getElementById("question-cover").textContent = correctAnswer + " or " + altAnswer
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
    for (verb of Object.keys(verbs)) {
        document.getElementById("table-verbs").innerHTML += `<button class="toggle-button" title="Toggle '${verb}' as a verb in problems." name="${verb}">${verb}</button>`
    }
    for (verbToggle of document.querySelectorAll("#table-verbs button")) {
        verbToggle.addEventListener("click", event => {
            let element = event.target
            if (element.className.includes(" active")) {
                element.className = element.className.replace(" active", "")
            } else {
                element.className += " active"
            }
            createProblem(verbs)
        })
    }
    for (verbTag of Object.keys(verbs)) {

    }

    //setup subject hightlighting
    try {
        for (verbTag of localStorage["vite-verbs"].split(",")) {
            let verb = document.querySelector(`button[name="${verbTag}"]`)
            verb.className = verb.className += " active"
        }
    } catch { }
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
        console.log(questionDataMod)
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
    for (activeVerb of document.querySelectorAll("#table-verbs button.active")) {
        activeVerbs.push(activeVerb.innerText)
    }
    localStorage["vite-verbs"] = activeVerbs
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
        question.answer = verbParent[question.subject]
        if (question.subject[question.subject.length - 1] === "e" && isVowel(question.answer[0])) {
            question.altSubject = question.subject.substr(0, question.subject.length - 1) + "'"
            altAnswer = (question.altSubject + question.answer).toLowerCase()
        } else {
            altAnswer = ([question.subject, question.answer].join(" ")).toLowerCase()
        }
    } else {
        window.alert("something went wrong while randomly picking a tense!")
    }
    return question
}
var verbs = {}
var subjects = localStorage["vite-subjects"].split(",")
window.addEventListener("load", function () {
    document.getElementById("stats-reset").addEventListener("click", resetTrackers)
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
            //enter key
            if (document.getElementById("question-cover").style.display != "none") {
                //PROBLEMS HERE
                document.getElementById("question-cover").style.display = "none"
                document.getElementById("question-cover").textContent = ""
                document.getElementById("question-cover").title = ""
                document.getElementById("question-cover").className = "check"
                createProblem()
            } else {
                submitAnswer()
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