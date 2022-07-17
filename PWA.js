if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/VITE/serviceWorker.js")
      .then((res) => {
        console.log("service worker registered");
        //firebase.messaging().useServiceWorker(res);
      })
      .catch((err) => console.warn("Service worker not registered w/ error:", err));
  });
}
