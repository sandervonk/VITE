let params = new URLSearchParams(window.location.search);
history.replaceState({}, "", window.location.href.substr(0, window.location.href.length - window.location.search.length));
