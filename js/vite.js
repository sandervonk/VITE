window.addEventListener("load", function () {
    //load JSON
    var verbs = {}
    var subjects = localStorage["vite-subjects"].split(",")
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
    for (toggle of document.querySelectorAll("#table-verbs button")) {
        toggle.addEventListener("click", function () {
            createProblem(verbs)
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
            })
        }
        for (verbTag of Object.keys(verbs)) {

        }

    }

    //function to form a new problem randomly
    function createProblem(verbs) {
        let questionData = returnProblem(verbs)
        if (questionData != "no-verbs" && questionData != "no-subjects") {
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
})