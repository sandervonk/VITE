$("#signin-overlay-button").click(function () {
  let redirectURL = "/FocusTime/app/";
  //   redirectURL = (window && window.parent) ? window.parent.location.href : "/FocusTime/app/"
  window.open("/VITE/?redirect=" + encodeURIComponent(redirectURL), "_parent");
});
$("#embed-content").click(function () {
  console.log("click");
  window.open("/VITE/app/", "_parent");
});
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
  if (user) {
    $("[data-role='authwall']").hide();
    $("[data-role='authcontent']").show();
  } else {
    $("[data-role='authwall']").show();
    $("[data-role='authcontent']").hide();
  }
});
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
