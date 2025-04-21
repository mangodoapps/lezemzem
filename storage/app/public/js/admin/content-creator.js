$(document).ready(function() {

    sortable();

    // Hide/Show Content Creator Item Content
    $(".content_creator .content_creator__items").on("click", ".content_creator__item .content_creator__item__title .content_creator__item__title__actions .fa-angle-down", function(e) {
        e.stopPropagation();
        $(this).closest(".content_creator__item").toggleClass("active");
        $(this).closest(".content_creator__item").find("> .content_creator__item__content").slideToggle();
    });

    // Remove Item
    $(".content_creator .content_creator__items").on("click", ".content_creator__item .content_creator__item__title .content_creator__item__title__actions .fa-xmark", function() {
        if ($(this).closest(".content_creator__items").parent().closest(".content_creator__items").length !== 0 && $(this).closest(".content_creator__items").find(".content_creator__item").length === 1) {
            var parent = $(this).closest(".inputs");
            $(this).closest(".content_creator__item").remove();
        }
        else {
            var parent = $(this).closest(".content_creator");
            $(this).closest(".content_creator__item").remove();
        }
        itemCountMessage(parent);
    });

    // Create Item
    $(".content_creator .content_creator__buttons .button").on("click", function() {
        const buttonName = $(this).attr("data-creator-button-name");
        const itemIndex = $(this).closest(".content_creator").attr("data-creator-index");
        const inputName = $(this).closest(".content_creator").attr("data-creator-input-name");
        const html = createItem(buttonName, inputName, itemIndex);
        $(this).closest(".content_creator").find("> .content_creator__items").append(html);
        createTinyMCE(buttonName);
        itemCountMessage($(this).closest(".content_creator"));
        sortable();
        $(this).closest(".content_creator").attr("data-creator-index", parseInt(itemIndex) + 1);
    });

    // Create Child Item
    $(document, window).on("click", ".content_creator__item .content_creator__item__content .content_creator__item__content__buttons .button", function() {
        const buttonName = $(this).attr("data-creator-button-name");
        const inputName = $(this).closest(".content_creator__item__content__buttons").attr("data-input-name");
        const index = $(this).closest(".content_creator__item").attr("data-child-item-index");
        const html = createItem(buttonName, inputName, index);
        $(this).closest(".content_creator__item").attr("data-child-item-index", parseInt(index) + 1);
        if ($(this).closest(".content_creator__item__content").find(".inputs .content_creator__items").length === 0) {
            $(this).closest(".content_creator__item__content").find(".inputs").append('<div class="content_creator__items flex column"></div>');
        }
        $(this).closest(".content_creator__item__content").find(".inputs .content_creator__items").append(html);
        itemCountMessage($(this).closest(".inputs"));
        createTinyMCE(buttonName);
        sortable();
    });

});

function createItem (itemName, inputName, index) {
    const getItemTitle = getItemName(itemName);
    const getItemTemplate = template(itemName, inputName, index);
    const itemHTML = `
        <div class="content_creator__item" data-child-item-index="0">
            <div class="content_creator__item__title flex">
                <span>${getItemTitle}</span>
                <div class="content_creator__item__title__actions flex">
                    <i class="fa-solid fa-xmark"></i>
                    <i class="fa-solid fa-arrows-up-down-left-right"></i>
                    <i class="fa-solid fa-angle-down"></i>
                </div>
            </div>
            <div class="content_creator__item__content">${getItemTemplate}</div>
        </div>
    `;
    return itemHTML;
}

function itemCountMessage (parent) {
    if (parent.find("> .content_creator__items > .content_creator__item").length === 0) {
        parent.find("> .content_creator__items").append('<span class="message">There are no items yet.</span>');
    }
    else {
        parent.find("> .content_creator__items > span.message").remove();
    }
}

function sortable () {
    $(".content_creator .content_creator__items").sortable({
        containment: "parent",
        axis: "y",
        handle: ".fa-arrows-up-down-left-right",
        opacity: 0.5,
        tolerance: "pointer",
        start: function(e, ui){
            tinymce.triggerSave();
        },
        stop: function( event, ui ) {
            $(this).find('textarea').each(function(){
                tinymce.execCommand( 'mceRemoveEditor', false, $(this).attr('id') );
                createTinyMCE("sortable-stop");
                tinymce.execCommand( 'mceAddEditor', false, $(this).attr('id') );
            });
        }
    });
}

