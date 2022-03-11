try {
  if (JSON.parse(localStorage["settings"]).theme == "dark") {
    document.getElementById("theme-dark-stylesheet").setAttribute("media", "");
  }
} catch {}
