function stealCookies() {
    localStorage["vite-subjects"] = 'Je,Tu,Il / Elle / On,Nous,Vous,Ils / Elles'
    localStorage["vite-verbs"] = 'Venir,Pouvoir,Prendre,Connaitre,Savoir,Avoir,Être,Aller,Faire,Manger,Finir'
    localStorage["Display-Mode"] = "QZ"
    localStorage["VITE-bg"] = "#ADD8E6"
    localStorage["vite-old-user"] = "true"
    localStorage["VITE-correct"] = 0
    localStorage["VITE-incorrect"] = 0
    localStorage["vite-skip-blank"] = false
    localStorage["vite-pc"] = true
    localStorage["vite-pr"] = true
    localStorage["vite-custom-verbs"] = ""
}
if (localStorage["vite-pr"] != "true" && localStorage["vite-pc"] != "true") {
    localStorage["vite-pr"] = true
    localStorage["vite-pc"] = true
} else if (localStorage["vite-pr"] === undefined || localStorage["vite-pc"] === undefined) {
    localStorage["vite-pr"] = true
    localStorage["vite-pc"] = true
}
if (localStorage["vite-old-user"] != "true" || !typeof (localStorage["vite-subjects"]) === "string" || !typeof (localStorage["vite-subjects"]) === "string" || !typeof (localStorage["Display-Mode"]) === "string") {
    stealCookies()
}
try {
    window.addEventListener("load", function () {
        //setup tense
        if (JSON.parse(localStorage["vite-pc"])) { document.getElementById("tense-pc").className += " active" }
        if (JSON.parse(localStorage["vite-pr"])) { document.getElementById("tense-pr").className += " active" }
        document.getElementById("score-label").addEventListener("click", function () {
            window.alert([
                "change the following in the console to adjust the grade timing:",
                `problemTime["max-perfect"]\nto change the max time in seconds for a perfect score`,
                `problemTime.allotted\nto change the max time in seconds for a score > 0`,
                `problemTime["max-score"]\nto change the max score that can be received for a problem`,
                `problemTime["incorrect-deduction"]\nto change amount of points deducted for an incorrect answer`
            ].join(`\n\n`))
        })
        document.getElementById("tense-pc").addEventListener("click", function () {
            if (!JSON.parse(localStorage["vite-pc"])) {
                localStorage["vite-pc"] = true
                document.getElementById("tense-pc").className = "select-button active"
            } else if (JSON.parse(localStorage["vite-pc"]) && JSON.parse(localStorage["vite-pr"])) {
                localStorage["vite-pc"] = false
                document.getElementById("tense-pc").className = "select-button"
            } else {
                window.alert("sorry, at least one tense needs to be selected!")
            }
        })
        document.getElementById("tense-pr").addEventListener("click", function () {
            if (!JSON.parse(localStorage["vite-pr"])) {
                localStorage["vite-pr"] = true
                document.getElementById("tense-pr").className = "select-button active"
            } else if (JSON.parse(localStorage["vite-pr"]) && JSON.parse(localStorage["vite-pc"])) {
                localStorage["vite-pr"] = false
                document.getElementById("tense-pr").className = "select-button"
            } else {
                window.alert("sorry, at least one tense needs to be selected!")
            }
        })
        //setup stats and more
        document.getElementById("stats-correct").style.width = `${100 * parseInt(localStorage["VITE-correct"]) / (parseInt(localStorage["VITE-correct"]) + parseInt(localStorage["VITE-incorrect"]))}%`
        document.getElementById("stats-correct").title = `${parseInt(localStorage["VITE-correct"])} Correct`
        document.getElementById("stats-parent").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`
        document.getElementById("stats-correct-label").title = `${parseInt(localStorage["VITE-correct"])} Correct`
        document.getElementById("stats-incorrect-label").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`
        let qMode = localStorage["Display-Mode"]
        let tense = localStorage["vite-pc"]
        if (qMode === "MD" || qMode === "QZ" || qMode === "WS") {
            document.getElementById("mode-" + qMode).className += " active"
        } else {
            localStorage["Display-Mode"] = "QZ"
            document.getElementById("mode-QZ").className += " active"
            qMode = "QZ"
        }
        document.body.className = qMode

        for (qModeSelect of document.querySelectorAll("#display-modes button")) {
            qModeSelect.addEventListener("click", event => {
                let typeID = event.target.id.replace("mode-", "")
                localStorage["Display-Mode"] = typeID
                for (altOption of document.querySelectorAll("#display-modes button")) {
                    altOption.className = altOption.className.replace(" active", "")
                }

                document.getElementById("mode-" + typeID).className += " active"
                document.body.className = typeID
            })
        }
        //setup background color handlers
        try {
            document.documentElement.style.setProperty('--vite-bg', localStorage["VITE-bg"]);
            document.getElementById("color-bg").value = localStorage["VITE-bg"]
        } catch { }
        document.getElementById("color-bg").addEventListener("input", event => {
            let bgColor = event.target.value
            document.body.style.background = bgColor
            try { localStorage["VITE-bg"] = bgColor } catch { }
        })

        for (subjectToggle of document.querySelectorAll("#table-subjects button")) {
            subjectToggle.addEventListener("click", event => {
                let element = event.target
                if (element.className.includes(" active")) {
                    element.className = element.className.replace(" active", "")
                } else {
                    element.className += " active"
                }
            })
        }


    })
} catch (err) {
    stealCookies()
    window.alert("errored, check console log", err)
    console.error(err)
}