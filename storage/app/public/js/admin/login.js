$(document).ready(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
        $(".login > span").text("").hide();
        $(".login button svg.fa-lock").hide();
        $(".login button svg.loading-animation").show();
        const fd = new FormData($(this)[0]);
        $.ajax({
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response);
                if (response.status === "failed") {
                    $(".login > span").text(response.message).show();
                    $(".login button svg.fa-lock").show();
                    $(".login button svg.loading-animation").hide();
                } else {
                    window.location.href = '/admin';
                }
            },
            error: function () {
                $(".login > span").text($(".login > span").attr("data-message-server-error")).show();
                $(".login button svg.fa-lock").show();
                $(".login button svg.loading-animation").hide();
            }
        });
    });
});