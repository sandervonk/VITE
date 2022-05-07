if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/VITE/new/serviceWorker.js")
      .then((res) => {
        console.log("service worker registered");
        try {
          firebase.messaging().useServiceWorker(res);
          firebase.messaging().setBackgroundMessageHandler(function (payload) {
            console.log(
              "[firebase-messaging-sw.js] Received background message ",
              payload
            );
            // Customize notification here
            const notificationTitle = "Background Message Title";
            const notificationOptions = {
              body: "Background Message body.",
              icon: "/icon-128x128.png",
            };

            return self.registration.showNotification(
              notificationTitle,
              notificationOptions
            );
          });
        } catch (err) {
          console.error("firebase messsaging err: ", err);
        }
      })
      .catch((err) => console.log("service worker not registered", err));
  });
}
