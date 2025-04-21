$(document).ready(function () {

    $("main > form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
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