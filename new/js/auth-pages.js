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
    console.log("user logged in:");
    let authData = auth.currentUser.metadata;
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
      } else {
      }
    } else {
    }
  } else {
    console.log("user logged out");
    localStorage.setItem("userData", "");
    localStorage.setItem("userId", "");
    window.open("../", "_self");
  }
});

//! listeners
$("[auth='logout-button']").click((e) => {
  auth.signOut();
});
