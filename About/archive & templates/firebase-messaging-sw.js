// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCZelR1HSbmcPf70rTI5Ig02yasL8RSdPw",
  authDomain: "vite-practice.firebaseapp.com",
  projectId: "vite-practice",
  storageBucket: "vite-practice.appspot.com",
  messagingSenderId: "559659689480",
  appId: "1:559659689480:web:417819295e1ad204e193bd",
  measurementId: "G-61KY0KX892",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
function checkNotify() {
  return new Promise((resolve, reject) => {
    if (Notification && Notification.permission != "granted") {
      resolve();
    } else {
      Notification.requestPermission().then((e) => {
        if (e == "granted") {
          resolve();
        } else {
          reject("error getting notification permission" + e);
        }
      });
    }
  });
}
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.getToken({
  vapidKey: "BPIghLBfHqAtB9qWjkDg96k-0uPy4FnliqvQvKiGjmC_dDFupBXrFPIThURj-iPW-rLUtPYits3Bi7odHyNA4Nc",
});
// Get registration token. Initially this makes a network call, once retrieved

// subsequent calls to getToken will return from cache.
messaging
  .getToken({
    vapidKey: "BPIghLBfHqAtB9qWjkDg96k-0uPy4FnliqvQvKiGjmC_dDFupBXrFPIThURj-iPW-rLUtPYits3Bi7odHyNA4Nc",
  })
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log("registration token:", currentToken);
    } else {
      // Show permission request UI
      console.log("No registration token available. Request permission to generate one.");
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };
  checkNotify
    .then(() => {
      self.registration.showNotification(notificationTitle, notificationOptions);
    })
    .catch((err) => {
      console.error(err);
    });
});
