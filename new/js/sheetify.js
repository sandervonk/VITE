function startApp() {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}
let numMatching = 2,
  filters = ["Passé Compose", "All Verbs", "Portrait"];
$("#results-header").text(
  `${numMatching} Template${numMatching == 1 ? "" : "s"} Avaliable`
);

$("#results-filters").text(filters.join(" • "));
