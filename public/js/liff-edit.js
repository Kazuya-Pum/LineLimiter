window.onload = function (e) {
    liff.init(function (data) {
        const userId = data.context.userId;
    },
    err => {
        // LIFF initialization failed
    });
};