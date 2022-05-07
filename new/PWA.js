if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/VITE/new/serviceWorker.js")
      .then((res) => {
        console.log("service worker registered");
        //firebase.messaging().useServiceWorker(res);
      })
      .catch((err) => console.log("service worker not registered", err));
  });
}
