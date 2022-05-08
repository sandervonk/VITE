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
  $("#results-header").text(
    `${templateArr.length} Template${
      templateArr.length == 1 ? "" : "s"
    } Avaliable`
  );
  for (templateObj of templateArr) {
    $("#results-grid").append(
      `<img src="../img/template/${templateObj.img}" title="${templateObj.name} | ${templateObj.author}" name="${templateObj.name}" class="template-img" />`
    );
  }
}
setupTemplates(templates);
$("#filters-from").on("change", () => {
  let matchings = templates,
    filters = [],
    filterText = [];
  $("select.options-item").each((i, e) => {
    e = $(e);
    if (e.val() != "" && e.val() != null) {
      filters.push({
        property: e.attr("id").replace("-select", ""),
        value: e.val(),
        valueText: $(`option[value='${e.val()}']`).text(),
      });
      filterText.push($(`option[value='${e.val()}']`).text());
    }
  });
  for (filter of filters) {
    matchings = $.grep(matchings, function (n, i) {
      return n.filters[filter.property].test(filter.value);
    });
  }
  $("#results-filters").text(filterText.join(" • "));
  setupTemplates(matchings);
});
$(document.body).on("click", "#results-grid > *", (e) => {
  $(document.body).addClass("right");
  $(document.body).scrollTop(09);
  $("#print-name").text($(e.target).attr("name"));
  let template = templates[0],
    numQuestions = 24,
    title = "Le Passé Composé: Les Verbes Aléatoires";
  $("#sheet-css").attr("href", "../css/templates/" + template.html.css);
  $("#template-print").html("[Template HTML]");
  let templateHTML =
    template.html.head +
    template.html.content.repeat(numQuestions) +
    template.html.foot;
  templateHTML = templateHTML
    .replace("%title%", title)
    .replace("%numQuestions%", numQuestions);
  $("#template-print").html(templateHTML);
});
