window.addEventListener("load", function () {

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
    document.getElementById("custom-button").addEventListener("click", function () {
        window.alert("Sorry, that feature isn't avalible yet :(")
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