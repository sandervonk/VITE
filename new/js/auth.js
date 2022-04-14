var verificationInterval;
//control pages of auth (for verification)
function firstPage() {
  $("#auth-box").removeClass("second");
  $("#auth-form").removeClass("inactive");
  $("#verification-box").addClass("inactive");
  $("#title-text").text("Get Started");
}
function secondPage() {
  $("#verification-email").text(auth.currentUser.email);
  $("#auth-box").addClass("second");
  $("#auth-form").addClass("inactive");
  $("#verification-box").removeClass("inactive");
  $("#title-text").text("Verify your Email");
}
//switch between pages
$("#change-email, #back-button").on("click", firstPage);
$(document.body).on("click", "#send-verification.ready", function () {
  window.location.reload();
});
//redirects
function openOnboard() {
  window.open("./onboarding.html", "_self");
}
function openApp() {
  window.open("./app/", "_self");
}
//catch errors
function authError(error) {
  console.error("caught and showed error: ", error);
  $("#email-input, #password-input").removeClass("error");
  new Toast(error.message, "default", 2000, "img/icon/error-icon.png");
  if (error.code.includes("password")) {
    $("#password-input").addClass("error");
  }
  if (error.code.includes("email")) {
    $("#email-input").addClass("error");
  }
  if ($("#password-input").val() == "") {
    $("#email-input, #password-input").addClass("error");
  }
}
function resetEmail() {
  auth
    .sendPasswordResetEmail($("#email-input").val())
    .then((r) => {
      new Toast(
        "Sent password reset email",
        "default",
        2000,
        "img/icon/success-icon.svg"
      );
    })
    .catch((err) => {
      new Toast(
        "Error sending reset email: " + err.message.replace("Error: ", ""),
        "default",
        2000,
        "img/icon/error-icon.svg"
      );
    });
}
//add listener for verify button
function verifyButton(userObj) {
  $(document.body).on("click", "#send-verification:not(.ready)", function () {
    //listen for verification approve
    if (verificationInterval == null) {
      verificationInterval = setInterval(function () {
        userObj.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(verificationInterval);
          $("#send-verification").val("Verified!");
          $("#send-verification").css({
            opacity: 1,
            "background-color": "#57DD35",
            "border-color": "#35BB13",
          });
          $("#send-verification").addClass("ready");
          new Toast(
            "Email Verified... Logging in",
            "default",
            2000,
            "img/icon/success-icon.png",
            "./"
          );
        }
      }, 1000);
    }

    //send verification email
    userObj.sendEmailVerification().then(
      function () {
        // Email sent.
        $("#send-verification").val("Resend Verification");
        $("#send-verification").css({ opacity: 0.5 });
      },
      function (error) {
        alert(
          `Something went wrong sending your verification email, try again later! \n\n` +
            error
        );
      }
    );
  });
}
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user logged in:");
    let authData = auth.currentUser.metadata;
    db.collection("users")
      .doc(auth.getUid())
      .set({ lastIn: new Date().getTime() }, { merge: true });
    db.collection("users")
      .doc(auth.getUid())
      .get()
      .then((doc) => {
        console.log(doc.data());
        localStorage.setItem("userData", JSON.stringify(doc.data()));
        localStorage.setItem("userId", auth.getUid());
      });
    if (auth.currentUser.emailVerified) {
      if (authData.creationTime === authData.lastSignInTime) {
        openOnboard();
      } else {
        openApp();
      }
    } else if (auth.currentUser.isAnonymous) {
      new Toast(
        "Logged in as guest, your progress will not be saved!",
        "default",
        1000,
        "./img/icon/info-icon.svg",
        "./onboarding.html"
      );
    } else {
      secondPage();
      verifyButton(user);
    }
  } else {
    console.log("user logged out");
    localStorage.setItem("userData", "");
    localStorage.setItem("userId", "");
  }
});

// signup
const authForm = $("#auth-form");
authForm.on("submit", (e) => {
  auth.signOut();
  e.preventDefault();
  const email = authForm[0]["email-input"].value;
  const password = authForm[0]["password-input"].value;
  if (document.activeElement.id == "signup") {
    // signup
    authPromise = auth.createUserWithEmailAndPassword(email, password);
    authPromise
      .then((user) => {
        $("#password-input, #email-input").removeClass("error");
        console.log("cred", user);
        //switch to verification page
        secondPage();
        db.collection("users").doc(auth.getUid()).set(
          {
            joined: new Date().getTime(),
          },
          { merge: true }
        );

        authForm[0].reset();
      })
      .catch((err) => authError(err));
  } else {
    // login
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        $("#password-input, #email-input").removeClass("error");
        console.log(user);
        authForm[0].reset();
      })
      .catch((err) => authError(err));
  }
});
$("#oauth-login").click((e) => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  firebase.auth().signInWithRedirect(provider);
});