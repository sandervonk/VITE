function getCalendarHTML(date, streakDays, goalNum) {
  // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
  let dayText = function (dateObj) {
    dateObj = new Date(dateObj);
    return [String(dateObj.getMonth() + 1).padStart(2, "0"), String(dateObj.getDate()).padStart(2, "0"), dateObj.getFullYear()].join("-");
  };
  let outputHTML = `<div id="streak-calendar" date="${date.toDateString()}">`,
    firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1),
    lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0),
    startVal = 0,
    dayGrid = [
      [0, "empty", ""],
      [0, "empty", ""],
      [0, "empty", ""],
      [0, "empty", ""],
      [0, "empty", ""],
      [0, "empty", ""],
    ];
  outputHTML += `<div id="streak-calendar-head"> <button class="calendar-button" id="cal-month-prev"></button> <div id="streak-month">${
    firstOfMonth.toLocaleString("en-us", { month: "long" }) +
    (firstOfMonth.getFullYear() == new Date().getFullYear() ? "" : " <span class='cal-year'>" + firstOfMonth.getFullYear()) +
    "</span>"
  }</div> <button class="calendar-button" id="cal-month-next"></button> </div>`;
  outputHTML += `<div id="streak-days">`;
  startVal = firstOfMonth.getDay();
  for (let day = startVal; day < lastOfMonth.getDate() + startVal; day++) {
    let dayXp = streakDays[dayText(firstOfMonth.setDate(1 - startVal + day))];
    dayVal = dayXp ? dayXp : 0;
    dayGrid[day] = [dayVal, dayVal >= goalNum ? "streak" : dayXp >= 0 ? "login" : "none", day - startVal + 1];
  }
  for (let i = 0; i < dayGrid.length; i++) {
    let dayAdd = Array.from(dayGrid[i]);
    if (dayGrid[i - 1] && dayGrid[i][1] == dayGrid[i - 1][1] && i % 7 != 0) {
      dayAdd[1] += " connect-left";
    }
    if (dayGrid[i + 1] && dayGrid[i][1] == dayGrid[i + 1][1] && i % 7 != 6) {
      dayAdd[1] += " connect-right";
    }
    outputHTML += `<div class="calendar-day day-${dayAdd[1]}" xp="${dayAdd[0]}">${dayAdd[2]}</div>`;
  }
  outputHTML += `</div></div>`;
  return outputHTML;
}
$(document).on("click", "body:not([header-collapsed]) [streak='calendar']", (e) => {
  $("#streak-overlay").remove();
  $(document.body).append(
    `<div id="streak-overlay" class="center">` +
      getCalendarHTML(new Date(), JSON.parse(localStorage.getItem("userData")).xphistory, JSON.parse(localStorage.getItem("userData")).goal) +
      `</div>`
  );
  $("#streak-overlay").addClass("fadein");
  $("#streak-calendar").addClass("fadezoomin");
});
$(document.body).on("click", "#streak-overlay", (e) => {
  if (e.target.id == "streak-overlay") {
    $("#streak-overlay").addClass("fadeout");
    $("#streak-calendar").addClass("fadezoomout");
  }
});
$(document.body).on("click", ".calendar-button", (e) => {
  let change = 0;
  if (e.target.id == "cal-month-prev") {
    change = -1;
  } else if (e.target.id == "cal-month-next") {
    change = 1;
  }
  let cal = $("#streak-calendar"),
    newDate = new Date(cal.attr("date")).setMonth(new Date(cal.attr("date")).getMonth() + change);
  cal.attr("date", new Date(newDate).toDateString());
  cal.html(
    getCalendarHTML(
      new Date(cal.attr("date")),
      JSON.parse(localStorage.getItem("userData")).xphistory,
      JSON.parse(localStorage.getItem("userData")).goal
    )
  );
});
