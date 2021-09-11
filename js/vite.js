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

//function to form a new problem randomly
function createProblem(verbsIn) {
    let questionSubjectElement = document.getElementById("question-subject-span"),
        questionVerbElement = document.getElementById("question-verb-span")
    if (arguments.length < 1) {
        verbsIn = verbs
    }
    let questionData = returnProblem(verbsIn)
    if (questionData != "no-verbs" && questionData != "no-subjects") {
        var correctAnswer = questionData.answer
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
    document.onkeydown = checkKey;

    function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
        }
        else if (e.keyCode == '40') {
            // down arrow
        }
        else if (e.keyCode == '37') {
            // left arrow
        }
        else if (e.keyCode == '39') {
            // right arrow
            createProblem()

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