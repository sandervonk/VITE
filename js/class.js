"use strict";
var userClasses = {},
  studentClass,
  studentClassID,
  userNamesJSON,
  studentPreviewDoc,
  currentClass;
$("[classload], [forstudent]").hide();
$("[memberlist] > .class-member, .class-member-wrapper").remove();
function setupApp() {
  return new Promise(function (fulfilled, rejected) {
    $("#student-class-name, #student-class-description, .codebox").text("").val("");
    $("[classload], [forstudent]").hide();
    db.collection("users")
      .doc("names")
      .get()
      .then((doc) => {
        userNamesJSON = doc.data();
        userDoc()
          .get()
          .then((doc) => {
            let userDocument = doc.data();
            userClasses = doc.data().classes;
            if (!userClasses || (!doc.data().classcode && doc.data().classcode != "")) {
              userDoc()
                .set({ classes: [], classcode: "" }, { merge: true })
                .then(() => {
                  window.location.reload();
                })
                .catch((err) => {
                  new ErrorToast("Error setting up default class data", err.toString(), 2000, ".");
                });
            }
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
          });
      })
      .catch((error) => {
        new ErrorToast("Error loading classes from user document", error.toString(), 2000);
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
      new ErrorToast("Error removing saved class code", err.code, 2000);
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
  $("[memberlist] > .class-member, .class-member-wrapper").remove();
  studentClass.members.forEach((memberID) => setupMember(memberID));
  if (studentClass.members.length < 1) {
    $("[memberlist]").append("<li class='class-member'>No members yet</li>");
  }
}
function studentNotInClass() {
  $("#student-leave-class").hide();
  $("#student-join-class").show();
  $("#add-button").text("CREATE CLASS");
  $("#student-leave-class, #student-leave-class *").addClass("disabled");
  $("#student-join-class, #student-join-class *").removeClass("disabled");
  new Toast("Looks like you dont have a class yet, lets get you started creating one. Try clicking the 'create class' button below", "default", 2000, "/VITE/img/icon/warning-icon.svg");
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
          if (studentClass.visibility == "public" || studentClass.invited.includes(auth.getUid()) || studentClass.invited.includes(auth.currentUser.email)) {
            new Toast("Looks like you're in a class, but not its member's list, adding you now...", "default", 2000, "/VITE/img/icon/warning-icon.svg");
            classDoc(doc.data().classcode)
              .update({ members: firebase.firestore.FieldValue.arrayUnion(auth.getUid()) })
              .then(() => {
                setupApp;
              });
          } else {
            new Toast("You're a saved member of a class, but it looks like it's private and you weren't invited, removing saved value", "default", 2000, "/VITE/img/icon/warning-icon.svg");
            removeSavedClassCode();
          }
        } else {
          new Toast("Found saved class code, but did not match any classes, removing", "default", 2000, "/VITE/img/icon/warning-icon.svg");
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
  new Toast("Creating a new class", "default", 750, "/VITE/img/icon/info-icon.svg", "./create.html");
}
function setupMember(memberID) {
  let memberText = memberID == auth.currentUser.uid ? "[You]" : userNamesJSON[memberID][0] + " (" + userNamesJSON[memberID][1] + ")";
  let memberStyle = userNamesJSON[memberID][2] ? `style='background-image: url("${fixPFPResolution(userNamesJSON[memberID][2])}")'` : "";
  let cm_options = memberID == auth.currentUser.uid || studentClass ? "" : '{ "icon": "cm-remove", "text": "Remove Student", "onclick": "removeStudentPopup(' + ` \`${memberText}\`, \`${memberID}\` ` + ')"}';
  $("[memberlist]").append(`<li class='class-member' cm-options='${cm_options}' memberid='${memberID}' title='${memberText}' ${memberStyle}></li>`);
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
        $("[memberlist] > .class-member, .class-member-wrapper").remove();
        doc.members.forEach((memberID) => setupMember(memberID));
        $("[classload], .member-list-ui").show();
        if (userClasses.length > 1) {
          $("#bottom-actions > *").removeClass("disabled");
        }
        $("#delete-button, #manage-button").removeClass("disabled");
        $("#class-index").text(userClasses.indexOf(id) + 1 + "/" + userClasses.length);
        $("[memberlist]").append(`<li id="more-members" class='class-member'><div id="list-icon" class="color-mask"></div></li>`);
        fulfilled();
      })
      .catch((error) => {
        new ErrorToast("Error loading class", error.toString(), 2000);
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
      new ErrorToast("Error deleting class", err.code, 2000);
      $("#delete-button").removeClass("disabled");
    });
}
/*student*/
function joinClass(attemptedCode) {
  classDoc(attemptedCode)
    .get()
    .then((classDocument) => {
      let prospectiveClass = classDocument.data();
      if (prospectiveClass.visibility == "public" || prospectiveClass.invited.includes(auth.getUid()) || prospectiveClass.invited.includes(auth.currentUser.email)) {
        classDoc(attemptedCode)
          .update({ members: firebase.firestore.FieldValue.arrayUnion(auth.getUid()) })
          .then(() => {
            userDoc()
              .update({ classcode: attemptedCode })
              .then(() => {
                new Toast("Joined class successfully!", "default", 2000, "/VITE/img/icon/success-icon.svg");
              })
              .catch((err) => {
                new ErrorToast("Could not save class code to user data", err.code, 2000);
              });
          })
          .catch((err) => {
            new ErrorToast("Something went wrong adding you to the members list", err.code, 2000);
            window.location.reload();
          });
      } else {
        new Toast("Sorry, this class is private, and you haven't been invited yet", "default", 2000, "/VITE/img/icon/warning-icon.svg");
      }
    })
    .catch((classErr) => {
      new Toast("Could not find a class for this code", "default", 2000, "/VITE/img/icon/warning-icon.svg");
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
          new Toast("Left class successfully!", "default", 2000, "/VITE/img/icon/success-icon.svg", "./index.html");
        })
        .catch((err) => {
          new ErrorToast("Could not remove class code from user data", err.code, 2000);
        });
    })
    .catch((err) => {
      new ErrorToast("Something went wrong removing you from the members list", err.code, 2000);
    });
  removePopup();
}
function copyJoinCode() {
  let el = $(this).children(".codebox")[0] ? $(this).children(".codebox")[0] : $(".codebox")[0];
  if (el.value == "") {
    new Toast("Make sure you've created a class to get your code, then tap here again to copy it", "default", 2000, "/VITE/img/icon/warning-icon.svg");
  } else {
    el.focus();
    el.select();
    navigator.clipboard
      .writeText(el.value)
      .then((res) => {
        console.log("Copied to clipboard");
        new Toast("Copied class code to clipboard", "transparent", 750, "/VITE/img/icon/clipboard-icon.svg");
      })
      .catch((err) => {
        new ErrorToast("Error copying class code" + err.toString(), 2000);
        $("#join-code, #student-class-code").removeAttr("disabled");
      });
  }
}
/*listeners*/
$("#class-code, #student-info-code-row").click(copyJoinCode);
$("#delete-button").click(function () {
  $(this).addClass("disabled");
  setTimeout(() => {
    $(this).removeClass("disabled");
  }, 10000);
  new Popup(["Delete class", "Are you sure you want to delete this class?"], "default delete-container", 10000, "", [
    ["removePopup(); $('#delete-button').removeClass('disabled')", "Cancel", "secondary-action fullborder"],
    ["deleteClass()", "Delete", "primary-action blue-button"],
  ]);
});
$("#student-leave-button").click(function () {
  $(this).addClass("disabled");
  setTimeout(() => {
    $(this).removeClass("disabled");
  }, 10000);
  new Popup(["Leave class", "Are you sure you want to leave this class?"], "default delete-container", 10000, "", [
    ["removePopup(); $('#student-leave-class, #student-leave-class *').removeClass('disabled')", "Cancel", "secondary-action fullborder"],
    ["leaveClass()", "Leave", "primary-action blue-button delete-color"],
  ]);
});

$("#student-join-button").click(function () {
  let attemptedCode = $("#student-join-code").val();
  if (attemptedCode == "") {
    new Toast("Please enter a class code", "default", 2000, "/VITE/img/icon/warning-icon.svg");
  } else {
    joinClass(attemptedCode);
  }
});
function removeStudent(studentID) {
  classDoc(currentClass)
    .update({ members: firebase.firestore.FieldValue.arrayRemove(studentID) })
    .then(() => {
      new Toast("Removed student successfully!", "default", 2000, "/VITE/img/icon/success-icon.svg");
      removePopup();
      $(`class-member-wrapper:has(.class-member[member-id="${studentID}"]), .class-member[member-id="${studentID}"]`).remove();
    })
    .catch((err) => {
      new ErrorToast("Error removing student", err.code, 2000);
      removePopup();
    });
}

function removeStudentPopup(name, id) {
  new Popup(["Remove Student", `Are you sure you want to remove ${name} from this class?`], "default delete-container", 10000, "", [
    ["removePopup()", "Cancel", "secondary-action fullborder"],
    [`removeStudent('${id}')`, "Remove", "primary-action blue-button delete-color"],
  ]);
}
function getCMOptions() {
  let added_options = [];
  if (currentClass || studentClass) {
    added_options.push({
      icon: "cm-copy",
      text: "Copy class code",
      onclick: (!studentClass ? `$("#class-code").click();` : `$("#student-info-code-row").click();`) + "closeContextMenu()",
    });
  }
  if (!studentClass) {
    added_options.push({
      icon: "cm-class",
      text: "Create Class",
      onclick: 'window.location.href = "./create.html"',
    });
  }

  return added_options.length ? added_options : false;
}
$(document.body).on("click", "#more-members", function () {
  $(this).remove();
  $("#class-preview-pane .class-member").wrap(`<div class="class-member-wrapper flex-row-nowrap"></div>`);
  $(".class-member-wrapper").append(function () {
    let memberName = $(this).children(".class-member").attr("title");
    let infoButton = memberName != "[You]" ? `<button class="class-member-option member-streak box-button fullborder" memberid="${$(this).children(".class-member").attr("memberid")}" title="View Streak">Streak</button>` : "";
    return `<div class="class-member-options flex-row-nowrap">
              <div class="class-member-info">${memberName}</div>
              ${infoButton}
            </div> `;
  });
});
$("[memberlist]").on("click", ".class-member-option.member-streak", function () {
  let memberID = $(this).attr("memberid");
  db.collection("users")
    .doc(memberID)
    .get()
    .then((doc) => {
      studentPreviewDoc = doc;
      doc = doc.data();
      calJSON = doc;
      $(document.body).append(`<div id="streak-overlay" class="center">` + getCalendarHTML(new Date(), calJSON.xphistory, calJSON.goal) + `</div>`);
    })
    .catch((err) => {
      studentPreviewDoc = {};
      new ErrorToast("Error getting student info", err.code, 2000);
    });
});
