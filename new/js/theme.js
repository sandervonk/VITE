try {
  if (JSON.parse(localStorage["userData"]).prefs.theme == "dark") {
    document
      .getElementById("theme-dark-stylesheet")
      .setAttribute("media", "not print");
    for (darkColor of document.querySelectorAll("#theme-dark-color")) {
      darkColor.setAttribute("media", "not print");
    }
    for (lightColor of document.querySelectorAll("#theme-light-color")) {
      lightColor.setAttribute(
        "media",
        "(prefers-color-scheme: unset) and not(print)"
      );
    }
  } else {
    document;
    for (lightColor of document.querySelectorAll("#theme-light-color")) {
      lightColor.setAttribute("media", "not print");
    }
  }
} catch (err) {
  console.error("Error setting theme: ", err);
}
