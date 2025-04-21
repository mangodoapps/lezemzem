$(document).ready(function() {
    tinyMCESetup();
    $('tbody').sortable({
        stop: function (event, ui) {
            var categoryId = $('tbody').data('id');
            var orders = getSortableData();
            postOrderData({categoryId, orders});
        }
    });
    $("main > form").on("submit", function(e) {
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
    $("main > form input[name='title[tr]']").on("input", function () {
        $("main > form input[name='url']").val(slug($(this).val()));
    });
});

function getSortableData() {
    // Bu fonksiyon, sıralı veriyi JSON formatına çevirir
    var sortableData = {};
    $('tbody').find('tr').each(function (index) {
        var rowId = $(this).data('id');
        sortableData[index] = rowId;
    });
    return sortableData;
}

function postOrderData (data) {
    const fd = new FormData();
    fd.append('sortableData', JSON.stringify(data));
    $.ajax({
        url: '/admin/categories/pageOrder',
        type: "POST",
        data: fd,
        contentType: false,
        processData: false,
        success: function (response) {
            //
        },
        error: function () {
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    });
}

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