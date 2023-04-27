if ("serviceWorker" in navigator) {
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
