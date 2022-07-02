var today = new Date(),
  updateJSON = {};
var dateRef = "xphistory." + [String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0"), today.getFullYear()].join("-");

function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}
param = new URLSearchParams(window.location.search);
results = {
  correct: param.get("correct"),
  total: param.get("total"),
  duration: parseInt(param.get("duration")),
};
if (Object.values(results).includes(null)) {
  window.location.href = "./";
}
history.replaceState({}, "", "results.html");
console.log(results);
$("#total .result-number").text(results.total);
let percentage_correct = parseInt((results.correct / results.total) * 100);
percentage_correct = percentage_correct.toString() == "NaN" ? "-" : percentage_correct;
$("#correct .result-number").text(percentage_correct + "%");
$("#time .result-number").text(Math.floor((results.duration / 1000 / 60) << 0) + ":" + pad2(Math.floor((results.duration / 1000) % 60)));
$("#xp .result-number").text(results.correct);
function startApp() {
  return new Promise(function (fulfilled, rejected) {
    if (parseInt(results.correct) != 0 && parseInt(results.correct) / 1 == parseInt(results.correct)) {
      console.log("adding to goals");
      let incrementFn = firebase.firestore.FieldValue.increment(parseInt(results.correct));
      let updatedJSON = {
        xp: incrementFn,
      };
      updateJSON[dateRef] = incrementFn;
      userDoc()
        .update(updateJSON, { merge: true })
        .then(() => {
          console.log("added to xp");
        });
    } else {
      console.log("invalid data");
    }
    fulfilled();
  });
}
