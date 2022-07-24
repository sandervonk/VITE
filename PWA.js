if ("serviceWorker" in navigator && !(location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
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
