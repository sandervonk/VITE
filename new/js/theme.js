try {
  if (JSON.parse(localStorage["userData"]).prefs.theme == "dark") {
    document
      .getElementById("theme-dark-stylesheet")
      .setAttribute("media", "not print");
  }
} catch (err) {}
