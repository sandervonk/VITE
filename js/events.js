if (localStorage["vite-old-user"] != "true" || !typeof (localStorage["vite-subjects"]) === "string" || !typeof (localStorage["vite-subjects"]) === "string" || !typeof (localStorage["Display-Mode"]) === "string") {
    localStorage["vite-subjects"] = 'Je,Tu,Il / Elle / On,Nous,Vous,Ils / Elles'
    localStorage["vite-verbs"] = 'Venir,Pouvoir,Prendre,Connaitre,Savoir,Avoir,Être,Aller'
    localStorage["Display-Mode"] = "MD"
    localStorage["VITE-bg"] = "#ADD8E6"
    localStorage["vite-old-user"] = "true"
    localStorage["VITE-correct"] = 0
    localStorage["VITE-incorrect"] = 0
    localStorage["vite-skip-blank"] = false
}
window.addEventListener("load", function () {
    document.getElementById("stats-correct").style.width = `${100 * parseInt(localStorage["VITE-correct"]) / (parseInt(localStorage["VITE-correct"]) + parseInt(localStorage["VITE-incorrect"]))}%`
    document.getElementById("stats-correct-label").title = `${parseInt(localStorage["VITE-correct"])} Correct`
    document.getElementById("stats-incorrect-label").title = `${parseInt(localStorage["VITE-incorrect"])} Incorrect`
    let qMode = localStorage["Display-Mode"]
    if (qMode === "MD" || qMode === "QZ" || qMode === "WS") {
        document.getElementById("mode-" + qMode).className += " active"
    } else {
        localStorage["Display-Mode"] = "MD"
        document.getElementById("mode-MD").className += " active"
        qMode = "MD"
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