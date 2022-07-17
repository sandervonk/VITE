function startApp() {
  return new Promise(function (fulfilled, rejected) {
    setTimeout(function () {
      fulfilled;
    }, 2000);
  });
}
$("#visibility-icon").click(function () {
  $(this).toggleClass("alt");
  $("#invites").toggle();
  $("#lock-icon").toggleClass("alt");
  $(this).attr("private", $(this).hasClass("alt"));
  new Toast(
    `Set class visibility to ${$(this).attr("private") == "true" ? "private" : "public"}`,
    "transparent",
    500,
    `../img/icon/info-${$(this).attr("private") == "true" ? "" : "un"}locked-icon.svg`
  );
});
$("#code-row").click(function () {
  el = $("#join-code")[0];
  if (el.value == "") {
    new Toast(
      "Make sure you've created the class to get your code, then tap here again to copy it",
      "default",
      2000,
      "/VITE/img/icon/warning-icon.svg"
    );
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
        new ErrorToast("Could not copy class code", err.toString(), 2000);
        $("#join-code").removeAttr("disabled");
      });
  }
});
$("#class-settings").on("input change", function () {
  if ($("#class-name").val().length >= 4) {
    $("#create-button").removeClass("disabled");
  } else {
    $("#create-button").addClass("disabled");
  }
});
$("#invites-add").submit(function (e) {
  e.preventDefault();
  if ($("#invites-add > input").val().length == 0) {
    new Toast("Please enter a valid email address", "default", 2000, "/VITE/img/icon/warning-icon.svg");
  } else {
    if ($("#invites-list > li").length >= 10) {
      new Toast("You can only invite 10 people to your class currently, sorry!", "default", 2000, "/VITE/img/icon/warning-icon.svg");
    } else if ($("#invites-list").has(`li[email="${$("#invites-add > input").val()}"]`).length > 0) {
      new Toast("You've already added this person", "default", 2000, "/VITE/img/icon/warning-icon.svg");
    } else {
      $("#invites-list").append(`<li email="${$("#invites-add > input").val()}">${$("#invites-add > input").val()}</li>`);
      new Toast("Added class member", "transparent", 750, "/VITE/img/icon/success-icon.svg");
    }
    $("#invites-add > input[type='email']").val("");
  }
});
$("#invites-list").on("click", "li[email]", function () {
  $(this).remove();
});
$("#bottom-actions").on("click", "#create-button:not(.disabled)", function () {
  let classdata = {};
  classdata.owner = firebase.auth().currentUser.uid;
  classdata.members = [classdata.owner];
  classdata.name = $("#class-name").val();
  classdata.visibility = $("#lock-icon").hasClass("alt") ? "private" : "public";
  classdata.description = $("#class-description").text();
  if ($("#lock-icon").hasClass("alt")) {
    classdata.invited = $("#invites-list > li")
      .map(function () {
        return $(this).attr("email");
      })
      .get();
    if (classdata.invited.length == 0) {
      new Toast("You need to add at least one member to create a private class", "default", 2000, "/VITE/img/icon/warning-icon.svg");
      throw "At least 1 member needed to create a private class";
    }
  }
  console.log(classdata);
  //shorthand for .push().set({})
  db.collection("classes")
    .add(classdata)
    .then((docRef) => {
      // Get the unique ID generated by push() by accessing its key
      var classID = docRef.id;
      userDoc()
        .update({ classes: firebase.firestore.FieldValue.arrayUnion(docRef.id) }, { merge: true })
        .then(() => {
          $("#join-code").val(classID);
          $("#create-button").text("CLASS CREATED");
          $("#create-button").addClass("disabled");
          new Toast("Class created successfully!", "default", 2000, "/VITE/img/icon/success-icon.svg", ".?class=" + classID);
          setTimeout(function () {
            $("#code-row").click();
          }, 750);
        });
    })
    .catch((error) => {
      console.error(error);
      new ErrorToast("Something went wrong creating this class", error.toString().replace("FirebaseError:", "database:"), 4000);
    });
});
function getCMOptions() {
  let added_options = [
    {
      icon: "cm-class",
      text: "Manage Classes",
      onclick: `window.location.href="./";closeContextMenu();`,
    },
  ];

  return added_options.length ? added_options : false;
}