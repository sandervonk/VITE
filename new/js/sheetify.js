$("#subjects-settings").text("[" + JSON.parse(localStorage.getItem("userData")).subjects.join("], [") + "]");
$("#verbs-settings").text(JSON.parse(localStorage.getItem("userData")).verbs.join(", "));
var verbs;
$.ajax({
  url: "../verbs.json",
  dataType: "json",
  success: (response) => {
    verbs = response;

    //console.log(verbs)
  },
  error: function (err) {
    console.error("error: could not load verbs.json :(");
    console.log(err);
  },
});
try {
  if (params.get("right") == "true" && params.has("template")) {
    $(document.body).addClass("right");
    $("#print-name, .template-name").text(params.get("template"));
  }
} catch (err) {}
function startApp() {
  return new Promise(function (resolve, reject) {
    resolve();
  });
}
var templates = [
  {
    filters: {
      orientation: /portrait/,
      verbs: /[\s\S]*/,
      tense: /[\s\S]*/,
    },
    author: "Sander Vonk",
    name: "VITE! Classic",
    img: "Template.svg",
    html: {
      css: "classic.css",
      head: `<div class="html-content" id="sheet-container"> <div id="sheet-fields"> <div id="sheet-nom" class="sheet-field"> Nom <div class="field-underline"></div></div><div id="sheet-periode" class="sheet-field"> Periode <div class="field-underline"></div></div><div id="sheet-score" class="sheet-field"> Score <div id="score-underline" class="field-underline"></div>/ %numQuestions% </div></div><div id="sheet-title">%title%</div><div id="sheet-content">`,
      content: `<div class="question-parent"> <div class="question-subject">%q-subject%</div><div class="question-row"> <div class="question-plus">+</div><div class="question-verb">%q-verb%</div></div><div class="question-answer">%q-answer%</div></div>`,
      foot: `</div></div>`,
    },
  },
];
//listeners
$("#reset-filters").click(() => {
  for (filter of $("select.options-item")) {
    $(filter).children("option").removeAttr("selected");
    $(filter).children("option[disabled]").attr("selected");
    $(filter).val("");
  }
  $("#results-filters").text("All • No Filters");
  setupTemplates(templates);
});
$("#settings-button").click(() => {
  $("#filter-options, #settings-button").addClass("active");
});

$("#options-overlay").click(() => {
  $("#filter-options, #settings-button").removeClass("active");
});
function setupTemplates(templateArr) {
  $("#results-grid > img").remove();
  $("#results-header").text(`${templateArr.length} Template${templateArr.length == 1 ? "" : "s"} Avaliable`);
  for (templateObj of templateArr) {
    $("#results-grid").append(
      `<img src="../img/template/${templateObj.img}" title="${templateObj.name} | ${templateObj.author}" alt="${templateObj.name} by ${templateObj.author}" name="${templateObj.name}" class="template-img" />`
    );
  }
}
setupTemplates(templates);
$("#filters-from").on("change", () => {
  let matchings = templates,
    filters = [],
    filterText = [];
  $("#filters-from select.options-item").each((i, e) => {
    e = $(e);
    if (e.val() != "" && e.val() != null) {
      filters.push({
        property: e.attr("id").replace("-select", ""),
        value: e.val(),
        valueText: $(`#filters-from option[value='${e.val()}']`).text(),
      });
      filterText.push($(`#filters-from option[value='${e.val()}']`).text());
    }
  });
  for (filter of filters) {
    matchings = $.grep(matchings, function (n, i) {
      return n.filters[filter.property].test(filter.value);
    });
  }
  $("#results-filters").text(filterText.join(" • "));

  $("#print-tense-select").val($("#tense-select").val() != null ? $("#tense-select").val() : "");
  setupTemplates(matchings);
});
function makePrint(name) {
  let template = templates[0],
    numQuestions = $("#ws-questions").val(),
    title = $("#ws-title").val(),
    selectedTense = $("#print-tense-select").val();
  try {
    template = $.grep(templates, function (n, i) {
      return n.name == name;
    })[0];
  } catch (err) {
    window.alert("Could not find matching template by name, got error:", err);
  }
  $("#sheet-css").attr("href", "../css/templates/" + template.html.css);
  $("#template-print").html("[Template HTML]");
  let templateContent = "";
  for (let questionNum = 0; questionNum <= numQuestions; questionNum++) {
    let options = {
      verb: random(JSON.parse(localStorage.getItem("userData")).verbs),
      subject: random(JSON.parse(localStorage.getItem("userData")).subjects),
      tense: selectedTense,
    };
    let questionData = new Question(options);
    templateContent += template.html.content
      .replace("%q-subject%", questionData.subject)
      .replace("%q-verb%", questionData.verb.toLowerCase())
      .replace("%q-answer%", questionData.answer.alt);
  }
  let templateHTML = template.html.head + templateContent + template.html.foot;
  templateHTML = templateHTML.replace("%title%", title).replace("%numQuestions%", numQuestions);
  $("#template-print").html(templateHTML);
}
$(document.body).on("click", "#results-grid > *", (e) => {
  let name = $(e.target).closest("img[name]").attr("name");
  $(document.body).addClass("right");
  $(document.body).scrollTop(0);
  $("#print-name").text($(e.target).attr("name"));
  makePrint(name);
});

$("#print-dropdowns").on("change, input", function () {
  if ($("#print-tense-select").val() != "" && $("#print-tense-select").val() != null) {
    $("#print-button, #answers-button").removeClass("disabled");
    makePrint($("#print-name").text());
  } else {
    $("#print-button, #answers-button").addClass("disabled");
  }
});
$("#print-tense-select").change(() => {
  $("#ws-title").val($("#print-tense-select :selected").text() != "Imparfait" ? "Le " + $("#print-tense-select :selected").text() : "L'imparfait");
});
