$(document).ready(function() {

    $(".windows__window[data-window-name='general-settings'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/settings/general-settings",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup(...Object.values(response));
                }, 200);
            },
            error: function () {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup("serverError", null, true, 5000);
                }, 200);
            }
        });
    });

    $(".windows__window[data-window-name='email-settings'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/settings/email-settings",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup(...Object.values(response));
                }, 200);
            },
            error: function () {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup("serverError", null, true, 5000);
                }, 200);
            }
        });
    });

    $(".windows__window[data-window-name='social-media'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/settings/social-media",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup(...Object.values(response));
                }, 200);
            },
            error: function () {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup("serverError", null, true, 5000);
                }, 200);
            }
        });
    });

    $(".windows__window[data-window-name='contact'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/settings/contact",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup(...Object.values(response));
                }, 200);
            },
            error: function () {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup("serverError", null, true, 5000);
                }, 200);
            }
        });
    });

    $(".windows__window[data-window-name='integrations'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/settings/integrations",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup(...Object.values(response));
                }, 200);
            },
            error: function () {
                loadingPopup(2);
                setTimeout(function () {
                    warningPopup("serverError", null, true, 5000);
                }, 200);
            }
        });
    });

});