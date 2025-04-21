$(document).ready(function() {
    createTinyMCE();

    // Submit Home Form
    $(".windows .windows__window[data-window-name='home'] form").on("submit", function(e) {
        e.preventDefault();
        loadingPopup(1);
        const fd = new FormData($(this)[0]);
        $.ajax({
            url: "/admin/theme/home",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                loadingPopup(2);
                setTimeout(function() {
                    warningPopup(...Object.values(response));
                }, 200);
            },
            error: function () {
                loadingPopup(2);
                setTimeout(function() {
                    warningPopup("serverError", null, true, 5000);
                }, 200);
            }
        });
    });
});

function getItemName(itemName) {
    if (itemName === "item") {
        return "New Item";
    }
    else if (itemName === "slider") {
        return "New Slider";
    }
}

function template(itemName, inputName, index) {
    if (itemName === "item") {
        return createItemTemplate(inputName, index);
    }
    else if (itemName === "slider") {
        return createSliderTemplate(inputName, index);
    }
}

function createItemTemplate(inputName, index) {
    return `
        <div class="inputs flex column">
            <div class="input flex column">
                <b>Title</b>
                <input type="text" name="${inputName}[${index}][title][tr]" placeholder="Title *" required class="input-text">
            </div>
            <div class="input flex column">
                <b>Content</b>
                <textarea name="${inputName}[${index}][content][tr]" class="editor" placeholder="Content"></textarea>
            </div>
            <div class="input flex column">
                <b>Image</b>
                <div class="input">
                    <label class="file-input file-manager-button button inline-flex purple-button">
                        <i class="fa-solid fa-file-import"></i>
                        <span data-default-text="Select Image">Select Image</span>
                        <input type="hidden" name="${inputName}[${index}][image]">
                    </label>
                </div>
            </div>
        </div>
    `;
}

function createSliderTemplate(inputName, index) {
    console.log(index);
    return `
        <div class="inputs flex column">
            <div class="input flex column">
                <b>Header</b>
                <input type="text" name="${inputName}[${index}][header][tr]" placeholder="Header *" required class="input-text">
            </div>
            <div class="input flex column">
                <b>Title</b>
                <input type="text" name="${inputName}[${index}][title][tr]" placeholder="Title *" required class="input-text">
            </div>
            <div class="input flex column">
                <b>Content</b>
                <textarea type="text" name="${inputName}[${index}][content][tr]" placeholder="Content *" required class="input-text"></textarea>
            </div>
            <div class="input flex column">
                <b>Image</b>
                <div class="input">
                    <label class="file-input file-manager-button button inline-flex purple-button">
                        <i class="fa-solid fa-file-import"></i>
                        <span data-default-text="Select Image">Select Image</span>
                        <input type="hidden" name="${inputName}[${index}][image][tr]">
                    </label>
                </div>
            </div>
            <div class="input flex column">
                <b>Link</b>
                <input type="text" name="${inputName}[${index}][link][tr]" placeholder="Link" class="input-text">
            </div>
            <div class="input flex column">
                <b>Status</b>
                <div class="input">
                    <label class="slide_checkbox">
                        <input type="checkbox" name="${inputName}[${index}][status]">
                        <div class="slide_checkbox__checkbox"></div>
                    </label>
                </div>
            </div>
            <div class="input flex column">
                <b>New Window</b>
                <div class="input">
                    <label class="slide_checkbox">
                        <input type="checkbox" name="${inputName}[${index}][new_window]">
                        <div class="slide_checkbox__checkbox"></div>
                    </label>
                </div>
            </div>
        </div>
    `;
}

function createTinyMCE() {
    tinymce.init({
        selector: '.editor',
        menubar: false,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount textcolor',
        toolbar: 'blocks fontsize | bold italic underline strikethrough | link image media table | align lineheight forecolor backcolor | numlist bullist indent outdent | emoticons charmap | removeformat',
    });
}