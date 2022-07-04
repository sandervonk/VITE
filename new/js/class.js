var userClasses = {};
function setupApp() {
  return new Promise(function (fulfilled, rejected) {
    userDoc()
      .get()
      .then((doc) => {
        userClasses = doc.data().classes;
        $("#class-index").text((userClasses.length > 0 ? "1" : "0") + "/" + userClasses.length);
        currentClass = userClasses[0];
        $("[classload]").hide();
        if (params && params.has("class")) {
          HTMLFromID(params.get("class"))
            .then(() => {
              fulfilled();
            })
            .catch((error) => {
              rejected(error);
            });
        } else {
          if (userClasses.length > 0) {
            HTMLFromID(currentClass)
              .then(() => {
                fulfilled();
              })
              .catch((error) => {
                rejected(error);
              });
          } else {
            new Toast(
              "Looks like you dont have a class yet, lets get you started creating one!",
              "default",
              2000,
              "../img/icon/warning-icon.svg",
              "./create.html"
            );
          }
        }
      })
      .catch((error) => {
        new Toast("Error loading classes from user document: " + error.toString(), "default", 2000, "../img/icon/warning-icon.svg");
        rejected(error);
      });
  });
}
//non-action setup functions
function createClass() {
  new Toast("Creating a new class", "default", 750, "../img/icon/info-icon.svg", "./create.html");
}
function cycleClasses(change) {
  let nextIndex = userClasses.indexOf(currentClass) + change;
  if (nextIndex < 0) {
    nextIndex = userClasses.length - 1;
  } else if (nextIndex > userClasses.length - 1) {
    nextIndex = 0;
  }
  currentClass = userClasses[nextIndex];
  $("#class-index").text(nextIndex + 1 + "/" + userClasses.length);
  return userClasses[nextIndex];
}
function HTMLFromID(id) {
  return new Promise(function (fulfilled, rejected) {
    classDoc(id)
      .get()
      .then(function (doc) {
        doc = doc.data();
        $("#class-name").text(doc.name);
        $("#class-description").text(doc.description);
        $("#join-code").val(id);
        if (doc.visibility == "private") {
          $("#lock-icon").addClass("alt");
          $("#invites-list").show();
          $("#invites-list > li").remove();
          doc.invited.forEach(function (email) {
            $("#invites-list").append(`<li email="${email}">${email}</li>`);
          });
        } else {
          $("#lock-icon").removeClass("alt");
          $("#invites-list").hide();
        }
        $("[classload]").show();
        if (userClasses.length > 1) {
          $("#bottom-actions > *").removeClass("disabled");
        }
        $("#delete-button, #manage-button").removeClass("disabled");
        $("#class-index").text(userClasses.indexOf(id) + 1 + "/" + userClasses.length);
        fulfilled();
      })
      .catch((error) => {
        new Toast("Error loading class: " + error.toString(), "default", 2000, "../img/icon/warning-icon.svg");
        $("[classload]").hide();
        $("#bottom-actions > *:not(#add-button)").addClass("disabled");
        $("#delete-button, #manage-button").addClass("disabled");
        rejected(error);
      });
  });
}
function deleteClass() {
  classDoc(currentClass)
    .delete()
    .then(() => {
      userDoc()
        .update({ classes: firebase.firestore.FieldValue.arrayRemove(currentClass) }, { merge: true })
        .then(() => {
          removePopup();
          window.location.reload();
        });
    })
    .catch((err) => {
      new Toast("Error deleting class: " + err.code, "default", 2000, "../img/icon/error-icon.svg");
      $("#delete-button").removeClass("disabled");
    });
}
$("#class-code").click(function () {
  el = $("#join-code")[0];
  if (el.value == "") {
    new Toast("Make sure you've created a class to get your code, then tap here again to copy it", "default", 2000, "../img/icon/warning-icon.svg");
  } else {
    el.focus();
    el.select();
    navigator.clipboard
      .writeText(el.value)
      .then((res) => {
        console.log("Copied to clipboard");
        new Toast("Copied class code to clipboard", "transparent", 750, "../img/icon/clipboard-icon.svg");
      })
      .catch((err) => {
        new Toast("Error copying class code: " + err.toString(), "default", 2000, "../img/icon/warning-icon.svg");
        $("#join-code").removeAttr("disabled");
      });
  }
});
$("#delete-button").click(function () {
  $(this).addClass("disabled");
  new Popup("Do you want to delete this class?", "box fullborder default", 10000, "../img/icon/info-icon.svg", [
    ["removePopup(); $('#delete-button').removeClass('disabled')", "Cancel", "secondary-action fullborder"],
    ["deleteClass()", "Yes", "primary-action blue-button delete-document"],
  ]);
});
$("#manage-button").click(function () {
  new Toast("Shhhhh dw about it I'm definitely not too lazy to implement this rn", "default", 1500, "../img/icon/concern-icon.svg");
});
