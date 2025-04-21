let warningPopupTimer;

$(document).ready(function() {

    // Main Left Sublink Click Event
    $(".main__left nav > ul > li > a").on("click", function() {
        if ($(this).hasClass("sublink")) {
            $(this).closest("li").find("> div.flex").slideToggle();
            $(this).closest("li").find("> a.flex").toggleClass("active");
        }
    });

    // Data-Table Action Button Click Event
    $(".data-table table tr td .actions .actions__buttons").on("click", "svg", function() {
        $(this).closest(".actions__buttons").find("ul").toggleClass("flex");
    });

    // File Input Change Input Event
    $(document, window).on("change", ".file-input input", function(e) {
        if (!$(this).closest(".file-input").hasClass(".file-manager")) {
            if ($(this)[0].files.length == 1) {
                $(this).closest(".file-input").find("span").html($(this)[0].files[0].name);
                $(this).closest(".file-input").find("svg").hide();
            }
            else if ($(this)[0].files.length >= 1) {
                $(this).closest(".file-input").find("span").html($(this)[0].files.length + " file(s) selected");
                $(this).closest(".file-input").find("svg").hide();
            }
            else {
                $(this).closest(".file-input").find("span").html($(this).closest(".file-input").find("span").attr("data-default-text"));
                $(this).closest(".file-input").find("svg").show();
            }
        }
    });

    // Close Warning Popup
    $(".warningPopup").on("click", "svg.fa-xmark", function() {
        if ($(this).attr("data-reload-page") === "true") {
            window.location.href = $(this).attr("data-reload-page-url");
        }
        else {
            $(".warningPopup").fadeOut(200);
            clearTimeout(warningPopupTimer);
        }
    });

    // Click Window Button in Windows 
    $(document).on("click", ".windows .windows__windows .button", function(e) {
        if ($(this).prop("nodeName") === "BUTTON")
            e.preventDefault();
        const windowName = $(this).attr("data-window-name");
        const parentElement = $(this).closest(".windows");
        $(this).closest(".windows__windows").find(".button").removeClass("purple-button");
        $(this).addClass("purple-button");
        parentElement.find("> .windows__window").removeClass("windows__active");
        parentElement.find("> .windows__window[data-window-name='"+ windowName +"']").addClass("windows__active");
    });

});

function loadingPopup (status) {
    if (status === 1) {
        $(".loadingPopup").fadeIn(200);
    } else {
        $(".loadingPopup").fadeOut(200);
    }
}

function slug (text) {
    const normalizedInput = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    const slug = normalizedInput
        .replace(/ /g, '-')
        .replace(/ı/g, 'i')
        .replace(/[^\w-]+/g, '');
    return slug;
}

function convertTimestampToDate(timestamp) {
    var date = new Date(parseInt(timestamp));

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var formattedDate = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;

    return formattedDate;
}

function warningPopup (status, message, reloadPage, timeout = 5000, url = window.location.href) {
    $(".warningPopup svg.fa-ban, .warningPopup svg.fa-check").remove();
    if (status === "success") {
        $(".warningPopup .warningPopup__content").prepend('<i class="fa-solid fa-check"></i>');
        $(".warningPopup .warningPopup__content .warningPopup__content__title").text($(".warningPopup .warningPopup__content .warningPopup__content__title").attr("data-message-success"));
    }
    else {
        $(".warningPopup .warningPopup__content").prepend('<i class="fa-solid fa-ban"></i>');
        $(".warningPopup .warningPopup__content .warningPopup__content__title").text($(".warningPopup .warningPopup__content .warningPopup__content__title").attr("data-message-unsuccess"));
    }
    if (status === "serverError") {
        $(".warningPopup .warningPopup__content .warningPopup__content__message").text($(".warningPopup .warningPopup__content .warningPopup__content__message").attr("data-message-server-error"));
    }
    else {
        $(".warningPopup .warningPopup__content .warningPopup__content__message").text(message);
    }
    $(".warningPopup .warningPopup__content .fa-xmark").attr("data-reload-page", reloadPage).attr("data-reload-page-url", url);
    warningPopupTimer = setTimeout(function() {
        if (reloadPage === true) {
            window.location.href = url;
        }
        else {
            $(".warningPopup").fadeOut(200);
        }
    }, timeout);
    $(".warningPopup").fadeIn(200);
}