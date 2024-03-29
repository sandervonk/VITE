"use strict";
const staticLinks = "cashe-VITE-[-version-number-]";
const OFFLINE_URL = "404.html";
const offlineFallbackPage = "404.html";
const OFFLINE_IMG = "/VITE/img/offline/image-offline.svg";
const assets = [
  "index.html",
  "404.html",
  "font/Feather-Bold.otf",
  "font/Next-Bold.otf",
  "font/Next-Light.otf",
  "font/Next-Medium.otf",
  "font/Next-Regular.otf",
  "font/Nunito-Bold.ttf",
  "font/Nunito-Light.ttf",
  "font/Nunito-Regular.ttf",
  "font/Nunito-Semibold.ttf",
  "img/offline/image-offline.svg",
  "img/offline/image-offline.png",
  "img/splash/offline-dark.svg",
  "img/splash/offline-light.svg",
  "img/splash/offline-dark.png",
  "img/splash/offline-light.png",
  "img/Earth.png",
  "img/Earth.svg",
  "img/card/wasteland.webp",
  "img/card/sheetify.webp",
  "img/card/dark/card=create.svg",
  "img/card/dark/card=learn.svg",
  "img/card/dark/card=study.svg",
  "img/card/dark/card=find.svg",
  "img/card/dark/card=educate.svg",
  "img/card/light/card=create.png",
  "img/card/light/card=create.svg",
  "img/card/light/card=learn.png",
  "img/card/light/card=learn.svg",
  "img/card/light/card=study.png",
  "img/card/light/card=study.svg",
  "img/card/light/card=find.png",
  "img/card/light/card=find.svg",
  "img/card/light/card=educate.png",
  "img/card/light/card=educate.svg",
  "img/icon/answered-icon.png",
  "img/icon/answered-icon.svg",
  "img/icon/back.png",
  "img/icon/back.svg",
  "img/icon/close.png",
  "img/icon/close.svg",
  "img/icon/correct-icon.png",
  "img/icon/correct-icon.svg",
  "img/icon/duration-icon.png",
  "img/icon/duration-icon.svg",
  "img/icon/error-icon.png",
  "img/icon/error-icon.svg",
  "img/icon/google.png",
  "img/icon/info-icon.png",
  "img/icon/info-icon.svg",
  "img/icon/pfp.webp",
  "img/icon/pfp.svg",
  "img/icon/reset-icon.png",
  "img/icon/reset-icon.svg",
  "img/icon/save-icon.png",
  "img/icon/save-icon.svg",
  "img/icon/success-icon.png",
  "img/icon/success-icon.svg",
  "img/icon/app/icon-128x128.png",
  "img/icon/app/icon-144x144.png",
  "img/icon/app/icon-152x152.png",
  "img/icon/app/icon-192x192.png",
  "img/icon/app/icon-384x384.png",
  "img/icon/app/icon-512x512.png",
  "img/icon/app/icon-72x72.png",
  "img/icon/app/icon-96x96.png",
  "img/icon/app/mobile/icon-128x128.png",
  "img/icon/app/mobile/icon-144x144.png",
  "img/icon/app/mobile/icon-152x152.png",
  "img/icon/app/mobile/icon-192x192.png",
  "img/icon/app/mobile/icon-384x384.png",
  "img/icon/app/mobile/icon-512x512.png",
  "img/icon/app/mobile/icon-72x72.png",
  "img/icon/app/mobile/icon-96x96.png",
  "img/icon/info/calendar.png",
  "img/icon/info/calendar.svg",
  "img/icon/info/gem.png",
  "img/icon/info/gem.svg",
  "img/icon/onboard/Book Icon.png",
  "img/icon/onboard/Book Icon.svg",
  "img/icon/onboard/Cap.png",
  "img/icon/onboard/Cap.svg",
  "img/icon/onboard/Egg.png",
  "img/icon/onboard/Egg.svg",
  "img/icon/onboard/Pencil.png",
  "img/icon/onboard/Pencil.svg",
  "img/icon/tabs/book.png",
  "img/icon/tabs/book.svg",
  "img/icon/tabs/book-lined.png",
  "img/icon/tabs/book-lined.svg",
  "img/icon/tabs/bullhorn.png",
  "img/icon/tabs/bullhorn.svg",
  "img/icon/tabs/bullhorn-lined.png",
  "img/icon/tabs/bullhorn-lined.svg",
  "img/icon/tabs/learn.svg",
  "img/icon/tabs/settings.png",
  "img/icon/tabs/settings.svg",
  "img/icon/tabs/settings-lined.png",
  "img/icon/tabs/settings-lined.svg",
  "img/icon/tutorial/arrow.png",
  "img/icon/tutorial/arrow.svg",
  "img/load/part=loading-1-light.svg",
  "img/load/part=loading-2-light.svg",
  "img/load/part=loading-3-light.svg",
  "img/load/part=loading-1-dark.svg",
  "img/load/part=loading-2-dark.svg",
  "img/load/part=loading-3-dark.svg",
  "img/mascot/full=Door.png",
  "img/mascot/full=Door.svg",
  "img/mascot/full=Driving.png",
  "img/mascot/full=Driving.svg",
  "img/mascot/full=Picnic.png",
  "img/mascot/full=Picnic.svg",
  "img/mascot/mood=Angry.png",
  "img/mascot/mood=Angry.svg",
  "img/mascot/mood=Basket.png",
  "img/mascot/mood=Basket.svg",
  "img/mascot/mood=BasketEmpty.png",
  "img/mascot/mood=BasketEmpty.svg",
  "img/mascot/mood=Bored.png",
  "img/mascot/mood=Bored.svg",
  "img/mascot/mood=Default.png",
  "img/mascot/mood=Default.svg",
  "img/mascot/mood=Depressed.png",
  "img/mascot/mood=Depressed.svg",
  "img/mascot/mood=Done.png",
  "img/mascot/mood=Done.svg",
  "img/mascot/mood=Excited.png",
  "img/mascot/mood=Excited.svg",
  "img/mascot/mood=Happy.png",
  "img/mascot/mood=Happy.svg",
  "img/mascot/mood=Have.png",
  "img/mascot/mood=Have.svg",
  "img/mascot/mood=Know.png",
  "img/mascot/mood=Know.svg",
  "img/mascot/mood=Resting.png",
  "img/mascot/mood=Resting.svg",
  "img/mascot/mood=Sad.png",
  "img/mascot/mood=Sad.svg",
  "img/mascot/mood=Sleep.png",
  "img/mascot/mood=Sleep.svg",
  "img/mascot/mood=Speaking.png",
  "img/mascot/mood=Speaking.svg",
  "img/mascot/mood=Surprised.png",
  "img/mascot/mood=Surprised.svg",
  "img/mascot/mood=Teared.png",
  "img/mascot/mood=Teared.svg",
  "img/mascot/mood=Think.png",
  "img/mascot/mood=Think.svg",
  "img/mascot/mood=Walk.png",
  "img/mascot/mood=Walk.svg",
  "img/mascot/mood=Waving.png",
  "img/mascot/mood=Waving.svg",
  "img/results/Celebration.png",
  "img/results/Celebration.svg",
];
try {
  var messagechannelBroadcast = new BroadcastChannel("messagechannel");
} catch (err) {
  console.warn("could not setup BroadcastChannel");
}
self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticLinks).then((cache) => {
      cache.addAll(assets);
    })
  );
});
self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches
      .match(fetchEvent.request)
      .then((res) => {
        return res || fetch(fetchEvent.request);
      })
      .catch((e) => {
        if (fetchEvent.request.url.split("?")[0].substr(-5) == ".html") {
          caches.match(OFFLINE_URL);
        } else {
          caches.match(OFFLINE_IMG);
        }
      })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data));
});

try {
  messagechannelBroadcast.onmessage = (event) => {
    let value = event.data.key;
    if (value == "clearsw") {
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });
      messagechannelBroadcast.postMessage({ key: "reloadCashe" });
    }
  };
} catch (err) {
  console.warn("could not setup BroadcastChannel listeners");
}
