// const IS_TESTING = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const IS_TESTING = false;
if ("serviceWorker" in navigator && !IS_TESTING) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((res) => {
      console.log("service worker registered:", res);
    })
    .catch((err) => console.warn("Service worker not registered w/ error:", err));
}
