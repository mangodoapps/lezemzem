document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const newPassword = document.querySelector('input[name="newPassword"]');
    const newPasswordMatch = document.querySelector('input[name="newPasswordMatch"]');
    const passwordError = document.getElementById('passwordError');

    form.addEventListener('submit', function (e) {
        if (newPassword.value !== newPasswordMatch.value) {
            e.preventDefault(); // Form gönderimini durdur
            passwordError.style.display = 'block'; // Hata mesajını göster
        } else {
            passwordError.style.display = 'none'; // Hata mesajını gizle
        }
    });
});

$(document).ready(function() {

    $(".windows__window[data-window-name='account'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/profile/account",
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

    $(".windows__window[data-window-name='change-password'] form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/profile/change-password",
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