var userClasses = {},
  studentClass,
  studentClassID;
$("[classload], [forstudent]").hide();
function setupApp() {
  return new Promise(function (fulfilled, rejected) {
    userDoc()
      .get()
      .then((doc) => {
        let userDocument = doc.data();
        userClasses = doc.data().classes;
        $("#class-index").text((userClasses.length > 0 ? "1" : "0") + "/" + userClasses.length);
        currentClass = userClasses[0];
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
            studentJoin(userDocument);
          }
        }
      })
      .catch((error) => {
        new Toast("Error loading classes from user document: " + error.toString(), "default", 2000, "../img/icon/warning-icon.svg");
        rejected(error);
      });
  });
}
function removeSavedClassCode() {
  userDoc()
    .update({ classcode: "" }, { merge: true })
    .then(() => {
      window.location.reload();
    })
    .catch((err) => {
      new Toast("Error removing saved class code: " + err.code, "default", 2000, "../img/icon/error-icon.svg");
    });
}
function studentInClass() {
  $("#student-leave-class").show();
  $("#student-join-class, #bottom-actions").hide();
  $("#student-leave-class, #student-leave-class *").removeClass("disabled");
  $("#student-join-class, #student-join-class *").addClass("disabled");
  $("#title-text").text("Student Class Dashboard");
  $("#student-join-options .section-title").text("Your Class:");
  $("#student-class-name").text(studentClass.name);
  $("#student-class-description").text(studentClass.description);
  $("#student-class-code").val(studentClassID);
  if (studentClass.visibility == "private") {
    $("#lock-icon").addClass("alt");
  }
}
function studentNotInClass() {
  $("#student-leave-class").hide();
  $("#student-join-class").show();
  $("#add-button").text("CREATE CLASS");
  $("#student-leave-class, #student-leave-class *").addClass("disabled");
  $("#student-join-class, #student-join-class *").removeClass("disabled");
  new Toast(
    "Looks like you dont have a class yet, lets get you started creating one. Try clicking the 'create class' button below",
    "default",
    2000,
    "../img/icon/warning-icon.svg"
  );
}
function studentJoin(userDocData) {
  $("[forstudent]").show();
  if (userDocData.classcode) {
    classDoc(userDocData.classcode)
      .get()
      .then((classDocument) => {
        if (classDocument.exists && classDocument.data().members.includes(auth.getUid())) {
          studentClass = classDocument.data();
          studentClassID = userDocData.classcode;
          studentInClass(classDocument);
        } else if (classDocument.exists) {
          studentClass = classDocument.data();
          studentClassID = userDocData.classcode;
          if (
            studentClass.visibility == "public" ||
            studentClass.invited.includes(auth.getUid()) ||
            studentClass.invited.includes(auth.currentUser.email)
          ) {
            new Toast("Looks like you're in a class, but not its member's list, adding you now...", "default", 2000, "../img/icon/warning-icon.svg");
            classDoc(doc.data().classcode)
              .update({ members: firebase.firestore.FieldValue.arrayUnion(auth.getUid()) })
              .then(() => {
                window.location.reload();
              });
          } else {
            new Toast(
              "You're a saved member of a class, but it looks like it's private and you weren't invited, removing saved value",
              "default",
              2000,
              "../img/icon/warning-icon.svg"
            );
            removeSavedClassCode();
          }
        } else {
          new Toast("Found saved class code, but did not match any classes, removing", "default", 2000, "../img/icon/warning-icon.svg");
          removeSavedClassCode();
        }
      })
      .catch((err) => {
        studentNotInClass();
      });
  } else {
    studentNotInClass();
  }
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
/*student*/
function joinClass(attemptedCode) {
  classDoc(attemptedCode)
    .get()
    .then((classDocument) => {
      prospectiveClass = classDocument.data();
      if (
        prospectiveClass.visibility == "public" ||
        prospectiveClass.invited.includes(auth.getUid()) ||
        prospectiveClass.invited.includes(auth.currentUser.email)
      ) {
        classDoc(attemptedCode)
          .update({ members: firebase.firestore.FieldValue.arrayUnion(auth.getUid()) })
          .then(() => {
            userDoc()
              .update({ classcode: attemptedCode })
              .then(() => {
                new Toast("Joined class successfully!", "default", 2000, "../img/icon/success-icon.svg", "./index.html");
              })
              .catch((err) => {
                new Toast("Could not save class code to user data: " + err.code, "default", 2000, "../img/icon/warning-icon.svg");
              });
          })
          .catch((err) => {
            new Toast("Something went wrong adding you to the members list: " + err.code, "default", 2000, "../img/icon/error-icon.svg");
          });
      } else {
        new Toast("Sorry, this class is private, and you haven't been invited yet", "default", 2000, "../img/icon/warning-icon.svg");
      }
    })
    .catch((err) => {
      new Toast("Could not find a class for this code: ", err, "default", 2000, "../img/icon/warning-icon.svg");
    });
}

function leaveClass() {
  $("#student-leave-class, #student-leave-class *").removeClass("disabled");
  classDoc(studentClassID)
    .update({ members: firebase.firestore.FieldValue.arrayRemove(auth.getUid()) })
    .then(() => {
      userDoc()
        .update({ classcode: "" })
        .then(() => {
          new Toast("Left class successfully!", "default", 2000, "../img/icon/success-icon.svg", "./index.html");
        })
        .catch((err) => {
          new Toast("Could not remove class code from user data: " + err.code, "default", 2000, "../img/icon/warning-icon.svg");
        });
    })
    .catch((err) => {
      new Toast("Something went wrong removing you from the members list: " + err.code, "default", 2000, "../img/icon/error-icon.svg");
    });
  removePopup();
}

/*listeners*/
$("#class-code, #student-info-code-row").click(function () {
  el = $(this).children(".codebox")[0];
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
        $("#join-code, #student-class-code").removeAttr("disabled");
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
$("#student-leave-button").click(function () {
  $(this).addClass("disabled");
  new Popup("Are you sure you want to leave this class?", "box fullborder default", 10000, "../img/icon/info-icon.svg", [
    ["removePopup(); $('#student-leave-class, #student-leave-class *').removeClass('disabled')", "Cancel", "secondary-action fullborder"],
    ["leaveClass()", "Yes", "primary-action blue-button delete-document"],
  ]);
});

$("#student-join-button").click(function () {
  let attemptedCode = $("#student-join-code").val();
  if (attemptedCode == "") {
    new Toast("Please enter a class code", "default", 2000, "../img/icon/warning-icon.svg");
  } else {
    joinClass(attemptedCode);
  }
});

$("[placeholdaction]").click(function () {
  new Toast("Shhhhh dw about it I'm definitely not too lazy to implement this rn", "default", 1500, "../img/icon/concern-icon.svg");
});
