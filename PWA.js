"serviceWorker"in navigator&&"localhost"!==location.hostname&&"127.0.0.1"!==location.hostname&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/VITE/serviceWorker.js").then(e=>{console.log("service worker registered")}).catch(e=>console.warn("Service worker not registered w/ error:",e))}));