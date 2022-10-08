$("#signin-overlay-button").click(function () {
  let redirectURL = "/FocusTime/app/";
  //   redirectURL = (window && window.parent) ? window.parent.location.href : "/FocusTime/app/"
  window.open("/VITE/?redirect=" + encodeURIComponent(redirectURL), "_parent");
});
$("#embed-content").click(function () {
  console.log("click");
  window.open("/VITE/app/", "_parent");
});
var today = new Date();
var date = [String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0"), today.getFullYear()].join("-");
const config = {
  apiKey: "AIzaSyCZelR1HSbmcPf70rTI5Ig02yasL8RSdPw",
  authDomain: "vite-practice.firebaseapp.com",
  projectId: "vite-practice",
  storageBucket: "vite-practice.appspot.com",
  messagingSenderId: "559659689480",
  appId: "1:559659689480:web:417819295e1ad204e193bd",
  measurementId: "G-61KY0KX892",
};
firebase.initializeApp(config);
const auth = firebase.auth(),
  db = firebase.firestore();
// database
db.settings({ timestampsInSnapshots: !0, merge: true });
var userDoc = function () {
  return db.collection("users").doc(auth.getUid());
};
// check auth and hide authwall if completed
auth.onAuthStateChanged(function (user) {
  console.log("auth state changed");
  $("#embed-context-menu").hide();
  if (user) {
    $("[data-role='authwall']").hide();
    setupContent();
    userDoc().onSnapshot(function (doc) {
      console.log("user doc changed");
      setupContent();
    });
  } else {
    $("[data-role='authwall']").show();
    $("[data-role='authcontent']").hide();
  }
});

// setup content from userdoc
function setupContent() {
  $("#user-image").attr("data", auth.currentUser.photoURL);
  $("#user-name").text(auth.currentUser.displayName);
  userDoc()
    .get()
    .then(function (doc) {
      let data = doc.data();
      if (data) {
        let todayXP = data.xphistory[date] ? data.xphistory[date] : 0;
        $("[data-role='authcontent']").show();
        $("#user-xp-bar-fill-text").attr({ "data-value": todayXP, "data-goal": data.goal + " xp" });
        $("#user-xp-bar-fill").css("width", (todayXP / data.goal) * 100 + "%");
        $("#total-xp").text(data.xp + " xp");
      } else {
        window.location.reload();
      }
    });
}
try {
  //*STARS
  let limit = 25,
    body = document.body;
  loop = {
    start: function () {
      for (var i = 0; i <= limit; i++) {
        var star = this.newStar();
        star.style.top = this.rand() * 100 + "%";
        star.style.left = this.rand() * 100 + "%";
        star.style.webkitAnimationDelay = this.rand() + "s";
        star.style.mozAnimationDelay = this.rand() + "s";
        document.getElementById("bg-stars").appendChild(star);
      }
    },
    //to get random number
    rand: function () {
      return Math.random();
    },
    //creating html dom for star
    newStar: function () {
      var d = document.createElement("div");
      d.innerHTML = '<figure class="star"></figure>';
      return d.firstChild;
    },
  };
  loop.start();
} catch (err) {}
$(document.body).on("contextmenu", function (e) {
  e.preventDefault();
  $("#embed-context-menu").toggle();
  //   window.open("/VITE/app/", "_blank");
  console.log("contextmenu");
});
$("#auth-signout").click(function () {
  auth.signOut();
});
