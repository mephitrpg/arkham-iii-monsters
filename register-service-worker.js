const isDevelopment = location.hostname === "localhost" || location.hostname === "127.0.0.1";

if (isDevelopment && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then(function (registrations) {
            return Promise.all(registrations.map(function (registration) {
                return registration.unregister();
            }));
        })
        .then(function () {
            return caches.keys();
        })
        .then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (cacheName) {
                return caches.delete(cacheName);
            }));
        });
} else if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./generate-sw.js")
        .then(function (registration) {
            console.log("Service worker registration succeeded: ", registration);
        })
        .catch(function (error) {
            console.error("Service worker registration failed: ", error);
        });
} else {
    console.log("Service workers are not supported");
}
