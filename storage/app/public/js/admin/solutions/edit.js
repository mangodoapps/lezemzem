$(document).ready(function () {

    tinyMCESetup();

    $("main > form").on("submit", function (e) {
        e.preventDefault();
        loadingPopup(1);
        tinymce.triggerSave();
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

    $("main > form input[name='title[tr]']").on("input", function () {
        $("main > form input[name='url']").val(slug($(this).val()));
    });

});

function createTinyMCE(itemName) {
    const itemNames = ["accordion", "editor", "sortable-stop"];
    if (itemNames.includes(itemName)) {
        tinyMCESetup();
    }
}

function tinyMCESetup () {
    tinymce.init({
        selector: '.editor',
        menubar: false,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount code',
        toolbar: 'blocks fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat code',
    });
}