window.addEventListener("load", function () {
    let qMode = localStorage["Display-Mode"]
    if (qMode === "MD" || qMode === "QZ" || qMode === "WS") {
        document.getElementById("mode-" + qMode).className += " active"
    } else {
        localStorage["Display-Mode"] = "MD"
        document.getElementById("mode-MD").className += " active"
    }

    for (qModeSelect of document.querySelector)

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
    for (subjectToggle of document.querySelectorAll(".table-left button")) {

    }
    for (verbToggle of document.querySelectorAll(".table-left button")) {

    }

})