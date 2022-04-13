//img
function setPhoto(url) {
  if (url != null) {
    $(".auth-picture").attr("src", url);
  }
}
//!setup
const config = {
  apiKey: "AIzaSyCZelR1HSbmcPf70rTI5Ig02yasL8RSdPw",
  authDomain: "vite-practice.firebaseapp.com",
  projectId: "vite-practice",
  storageBucket: "vite-practice.appspot.com",
  messagingSenderId: "559659689480",
  appId: "1:559659689480:web:417819295e1ad204e193bd",
  measurementId: "G-61KY0KX892",
};

// Initialize Firebase
firebase.initializeApp(config);
// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshots: true });

//!code
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user logged in");

    setPhoto(user.photoURL);
    let authData = auth.currentUser.metadata;
    db.collection("users")
      .doc(auth.getUid())
      .set({ lastIn: new Date().getTime() }, { merge: true });
    db.collection("users")
      .doc(auth.getUid())
      .get()
      .then((doc) => {
        localStorage.setItem("userData", JSON.stringify(doc.data()));
        localStorage.setItem("userId", auth.getUid());
      });
    if (!auth.currentUser.emailVerified) {
      new Toast(
        "Please verify your email to use the app!",
        "default",
        3000,
        "../img/icon/info-icon.svg",
        "../"
      );
    } else {
      /*
      new Toast(
        "Logged in successfully!",
        "default",
        500,
        "../img/icon/info-icon.svg"
      );
      */ try {
        startApp().then((r) => {
          if ($("meta[name=runapp]").prop("content")) {
            showQuestion(new Question());
          } else if ($("meta[name=runsetup]").prop("content")) {
            setupSetup();
          }
        });
      } catch {
        console.error("could not start app");
      }
    }
  } else {
    console.log("user logged out");
    localStorage.setItem("userData", "");
    localStorage.setItem("userId", "");
    new Toast(
      "Please login to use the app!",
      "default",
      1000,
      "../img/icon/info-icon.svg",
      "../"
    );
  }
});

//! listeners
$("[auth='logout-button']").click((e) => {
  auth.signOut();
});
