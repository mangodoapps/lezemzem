$(document).ready(function () {
    $('tbody').sortable({
        stop: function (event, ui) {
            postOrderData(getSortableData());
        }
    });
});

function getSortableData() {
    // Bu fonksiyon, sıralı veriyi JSON formatına çevirir
    var sortableData = {};
    $('tbody').find('tr').each(function (index) {
        var rowId = $(this).data('id');
        sortableData[rowId] = index;
    });
    return sortableData;
}

function postOrderData (data) {
    const fd = new FormData();
    fd.append('sortableData', JSON.stringify(data));
    $.ajax({
        url: '/admin/solutions/categories/order',
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