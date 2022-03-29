function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}
param = new URLSearchParams(window.location.search);
results = {
  correct: param.get("correct"),
  total: param.get("total"),
  duration: parseInt(param.get("duration")),
};

history.replaceState({}, "", "results.html");
console.log(results);
$("#total .result-number").text(results.total);

$("#correct .result-number").text(
  parseInt((results.correct / results.total) * 100) + "%"
);
$("#time .result-number").text(
  Math.floor((results.duration / 1000 / 60) << 0) +
    ":" +
    pad2(Math.floor((results.duration / 1000) % 60))
);
