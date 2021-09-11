//answer handler
var correctAnswer = ""
function showAnswer(input) {
    document.getElementById("question-answer-input").value = ""
    let coverEle = document.getElementById("question-cover")
    if (input.toLowerCase() === correctAnswer) {
        coverEle.className = "check correct"
    } else {
        coverEle.className = "check incorrect"
        document.getElementById("question-cover").textContent = correctAnswer
    }
    //setup the needed things to make it go away
    coverEle.style.display = ""
    coverEle.addEventListener("click", function () {
        if (document.getElementById("question-cover").className.includes("correct")) {
            document.getElementById("question-cover").className = "check"
            document.getElementById("question-cover").textContent = ""
            document.getElementById("question-cover").style.display = "none"
        }

    })
    document.addEventListener("keydown", e => {
        if (e.keyCode == '13' && document.getElementById("question-cover").className.includes("correct")) {
            document.getElementById("question-cover").className = "check"
            document.getElementById("question-cover").textContent = ""
            document.getElementById("question-cover").style.display = "none"
        }
    })
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
}
//function to handle answer
function submitAnswer() {
    let answerElement = document.getElementById("question-answer-input")
    if (answerElement.value === "") {
        createProblem()
    } else {
        showAnswer(answerElement.value)
        createProblem()
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
        questionSubjectElement.innerText = questionData.subject
        questionVerbElement.innerText = questionData.verb
        console.log(questionData)
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
        verbParent = verbs[Object.keys(verbs)[ranV]]
    console.log(ranV)
    console.log(verbs)

    question.subject = activeSubjects[ranS]
    question.verb = Object.keys(verbs)[ranV]
    question.answer = verbParent[question.subject]
    return question
}
var verbs = {}
var subjects = localStorage["vite-subjects"].split(",")
window.addEventListener("load", function () {
    document.getElementById("question-cover").addEventListener("click", function () {
        document.getElementById("question-cover").style.display = "none"
        document.getElementById("question-cover").className = "check"
        createProblem()
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
            // enter key
            if (document.getElementById("question-cover").style.display != "none") {
                document.getElementById("question-cover").style.display = "none"
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