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
    document.getElementById("stats-correct-label").title = `${parseInt(localStorage["VITE-correct"])} Correct`
    document.getElementById("stats-incorrect-label").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`
    //setup the needed things to make it go away

}
//setup verb sidebar
function setupVerbs(verbs) {
    for (verb of Object.keys(verbs)) {
        document.getElementById("table-verbs").innerHTML += `<button class="toggle-button" name="${verb}">${verb}</button>`
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
        if (questionData.subject[questionData.subject.length - 1] === "e" && isVowel(questionData.answer[0])) {
            questionData.altSubject = questionData.subject.substr(0, questionData.subject.length - 1) + "'"
            altAnswer = (questionData.altSubject + questionData.answer).toLowerCase()
        } else {
            altAnswer = ([questionData.subject, questionData.answer].join(" ")).toLowerCase()
        }
        correctWithSubject = questionData
        questionSubjectElement.innerText = questionData.subject
        questionVerbElement.innerText = questionData.verb
        let questionDataMod = questionData
        questionDataMod.answer = "Haha Nice Try"
        console.log(questionDataMod)
    } else {

    }

}
function returnProblem(verbs) {
    let activeSubjects = []
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
    question.answer = verbParent[question.subject]
    return question
}
var verbs = {}
var subjects = localStorage["vite-subjects"].split(",")
window.addEventListener("load", function () {
    document.getElementById("stats-reset").addEventListener("click", resetTrackers)
    document.getElementById("question-cover").addEventListener("click", function () {
        if (!document.getElementById("question-cover").className.includes("correct")) {
            document.getElementById("question-cover").style.display = "none"
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
            console.log(verbs)
        },
        error: function (err) {
            console.error("error: could not load projects.json :(")
            //console.log(err)
        }
    });
    //listener
    for (toggle of document.querySelectorAll("#table-subjects button")) {
        toggle.addEventListener("click", function () {
            createProblem(verbs)
        })
    }


})