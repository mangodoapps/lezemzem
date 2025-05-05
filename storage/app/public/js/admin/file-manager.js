var fileManagerSelectedInputElement;

$(document).ready(async function () {

    let clickCount = 0;
    let clickTimer;
    hideButtonsAndFileDetailsWindow();
    // Open File Manager
    $(document, window).on("click", ".file-input.file-manager-button", async function () {
        loadingPopup(1);
        $(".file-manager").fadeIn(200);
        await getFolders("/");
        await getFiles("/");
        showFolder("/");
        loadingPopup(2);
        fileManagerSelectedInputElement = $(this);
    });

    // Click New Folder
    $(".file-manager > .flex > section:first-of-type button").click(async function () {
        loadingPopup(1);
        hideButtonsAndFileDetailsWindow();
        const selectedFolder = $(".file-manager > .flex > section:first-of-type a.selected");
        await newFolder(selectedFolder.attr("data-path"));
        await getFiles(selectedFolder.attr("data-path"));
        loadingPopup(2);
    });

    // Click Folder in Folder List
    $(".file-manager > .flex > section:first-of-type").on("click", "a", async function () {
        loadingPopup(1);
        const path = $(this).attr("data-path");
        hideButtonsAndFileDetailsWindow();
        await getFolders(path);
        if ($(this).hasClass("active") && $(this).hasClass("selected")) {
            $(this).removeClass("active");
            $(this).closest("li").find("> ul").slideToggle(200);
        }
        else if ((!$(this).hasClass("active") && $(this).hasClass("selected")) || (!$(this).hasClass("active") && !$(this).hasClass("selected"))) {
            $(this).addClass("active");
            $(this).closest("li").find("> ul").slideToggle(200, function () {
                if ($(this).is(':visible'))
                    $(this).css('display', 'flex');
            });
        }
        $(".file-manager > .flex > section:first-of-type a.selected").removeClass("selected");
        $(this).addClass("selected");
        await getFiles(path);
        loadingPopup(2);
    });

    // File Click - Event Delegation ile
    $(document).on("click", ".file-manager .file-manager__files a", async function () {
        const fileElement = $(this);
        clickCount++;

        // Single Click
        if (clickCount === 1) {
            clickTimer = setTimeout(async function () {
                clickCount = 0;
                loadingPopup(1);
                const fileID = fileElement.attr("data-id");
                await getFile(fileID);
                loadingPopup(2);
            }, 200);

            // Double Click
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            console.log(fileElement.attr("data-id"), fileElement.find("span").text());

            if (fileElement.attr("data-type") == "file") {
                if (fileManagerSelectedInputElement.find("span").text() != "File Manager") {
                    fileManagerSelectedInputElement.find("span").text(fileElement.find("span").text());
                    fileManagerSelectedInputElement.find("input").val(fileElement.attr("data-id"));
                }
            }
            $(".file-manager").fadeOut(200);
        }
    });


    // Delete File
    $(".file-manager .file-manager__buttons button[data-button-name='delete']").on("click", async function () {
        loadingPopup(1);
        hideButtonsAndFileDetailsWindow();
        const fileID = $(".file-manager .file-manager__files a.selected").attr("data-id");
        await deleteFile(fileID);
        loadingPopup(2);
    });

    // Upload File
    $(".file-manager .file-manager__buttons button[data-button-name='upload-file']").on("click", async function () {
        hideButtonsAndFileDetailsWindow();
        uploadFile();
    });

    // Update
    $(".file-manager > .flex > section:last-of-type form").on("submit", async function (e) {
        const id = $(".file-manager .file-manager__files a.selected").attr("data-id");
        const fd = new FormData($(this)[0]);
        fd.append("id", id);
        e.preventDefault();
        loadingPopup(1);
        update(fd);
        loadingPopup(2);
    });

    // Close File Manager
    $(".file-manager > .flex").on("click", "> svg.fa-xmark", function () {
        $(".file-manager").fadeOut(200);
        fileManagerSelectedInputElement.find("span").text(fileManagerSelectedInputElement.find("span").attr("data-default-text"));
        fileManagerSelectedInputElement.find("input").val("");
    });

    // Search
    $(".file-manager__buttons > input").on("input", async function () {
        hideButtonsAndFileDetailsWindow();
        await getFiles("/");
    });

    // Save Button
    $(".green-button").on("click", function () {
        const selectedFile = $(".file-manager .file-manager__files a.flex.column.selected").first();
        if (selectedFile.length > 0) {
            selectedFile.trigger("click"); // İlk tıklama
            setTimeout(() => {
                selectedFile.trigger("click"); // İkinci tıklama
            }, 100); // Zamanlama, çift tıklama algılaması için yeterince kısa olmalı
        }
    });

    function showFolder(path) {
        const folder = $(".file-manager > .flex > section:first-of-type a[data-path='" + path + "']");
        folder.addClass("active");
        folder.closest("li").find("> ul").slideDown(200, function () {
            if ($(this).is(':visible'))
                $(this).css('display', 'flex');
        });
    }

    function hideButtonsAndFileDetailsWindow() {
        $(".file-manager .file-manager__buttons button[data-button-name='delete']").hide();
        $(".file-manager > .flex > section:first-of-type + section").removeClass("minimized");
        $(".file-manager > .flex > section:last-of-type").removeClass("active");
    }

    async function newFolder(path) {
        const fd = new FormData();
        fd.append("path", path);
        try {
            const response = await fetch("/admin/file-manager/new-folder", {
                method: "POST",
                body: fd,
            });
            const data = await response.json();

            if (data.status === "failed") {
                loadingPopup(2);
                setTimeout(() => {
                    warningPopup(...Object.values(data));
                }, 200);
            } else {
                await getFolders(path);
                showFolder(path);
            }
        } catch (error) {
            loadingPopup(2);
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    }

    async function getFolders(path) {
        try {
            const queryParams = new URLSearchParams({ path }).toString();
            const response = await fetch(`/admin/file-manager/get-folders?${queryParams}`);
            const data = await response.json();

            if (data.status === "failed") {
                loadingPopup(2);
                setTimeout(() => {
                    warningPopup(...Object.values(data));
                }, 200);
            } else {
                const folder = $(".file-manager > .flex > section:first-of-type a[data-path='" + path + "']");
                if (Object.keys(data.folders).length !== 0) {
                    if (folder.closest("li").find("> ul").length === 0) {
                        if (folder.find("svg.fa-caret-right").length === 0)
                            folder.prepend('<i class="fa-solid fa-caret-right"></i>');
                        folder.closest("li").append('<ul class="flex column"></ul>');
                    }
                    else {
                        folder.closest("li").find("> ul").html("");
                    }
                    for (const folderData of Object.values(data.folders)) {
                        folder.closest("li").find("> ul").append(`
                            <li>
                                <a class="flex" data-path="${path === '/' ? '' : path}/${folderData.name}">
                                    ${folderData.subfolderCount !== 0 ? '<i class="fa-solid fa-caret-right"></i>' : ''}
                                    <i class="fa-solid fa-folder"></i>
                                    <span>${folderData.name}</span>
                                </a>
                            </li>
                        `);
                    }
                }
                else {
                    folder.closest("li").find("> ul").remove();
                    folder.find("svg.fa-caret-right").remove();
                }
            }
        } catch (error) {
            loadingPopup(2);
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    }

    async function getFiles(path) {
        try {
            const requestData = {
                search: $(".file-manager__buttons > input").val()
            };
            console.log(`${encodeURIComponent(path)}`);
            const response = await fetch(`/admin/file-manager/get-files?path=${encodeURIComponent(path)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            if (data.status === "failed") {
                loadingPopup(2);
                setTimeout(() => {
                    warningPopup(...Object.values(data));
                }, 200);
            } else {
                $(".file-manager .file-manager__files").removeClass("grid").html("");
                if (Object.keys(data.files).length !== 0) {
                    $(".file-manager .file-manager__files").addClass("grid");
                    for (const file of Object.values(data.files)) {
                        $(".file-manager .file-manager__files").append(`
                            <a class="flex column" data-id='${file.id}' data-type='${file.type}'>
                                <div class="file-manager__files__icon">
                                    ${file.type === "folder" ? '<i class="fa-solid fa-folder"></i>' : '<i class="fa-solid fa-file"></i>'}
                                </div>
                                <span>${file.name}</span>
                            </a>
                        `);
                    }
                } else {
                    const message = $(".file-manager .file-manager__files").attr("data-no-file-message")
                    $(".file-manager .file-manager__files").append("<span>" + message + "</span>");
                }
            }
        } catch (error) {
            loadingPopup(2);
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    }

    async function getFile(id) {
        try {
            const response = await fetch(`/admin/file-manager/get-file?id=${id}`);
            const data = await response.json();
            if (data.status === "failed") {
                loadingPopup(2);
                setTimeout(() => {
                    warningPopup(...Object.values(data));
                }, 200);
            } else {
                const fileElement = $(".file-manager .file-manager__files a[data-id='" + id + "']");

                $(".file-manager .file-manager__buttons button[data-button-name='delete']").removeAttr("style");
                $(".file-manager .file-manager__files a.selected").removeClass("selected");
                $(".file-manager > .flex > section:first-of-type + section").addClass("minimized");
                $(".file-manager > .flex > section:last-of-type").addClass("active");
                fileElement.addClass("selected");

                $(".file-manager > .flex > section:last-of-type input[name='name']").val(data.file.name);
                if (data.file.type === "file") {
                    $(".file-manager > .flex > section:last-of-type span[data-name='file_name'] a").text(data.file.file_name)
                        .attr("href", "/static/storage/upload_files" + (data.file.path === "/" ? '' : data.file.path) + "/" + data.file.file_name);
                    $(".file-manager > .flex > section:last-of-type span[data-name='uploaded_by']").text(data.file.creator);
                    $(".file-manager > .flex > section:last-of-type span[data-name='uploaded_at']").text(data.file.created_at);
                    $(".file-manager > .flex > section:last-of-type span[data-name='file_name']").closest(".input").show();
                    $(".file-manager > .flex > section:last-of-type span[data-name='uploaded_by']").closest(".input").find("b").text("Yükleyen");
                    $(".file-manager > .flex > section:last-of-type span[data-name='uploaded_at']").closest(".input").find("b").text("Y. Tarihi");
                }
                else {
                    $(".file-manager > .flex > section:last-of-type span[data-name='file_name']").closest(".input").hide();
                    $(".file-manager > .flex > section:last-of-type span[data-name='uploaded_by']").closest(".input").find("b").text("Created By");
                    $(".file-manager > .flex > section:last-of-type span[data-name='uploaded_at']").closest(".input").find("b").text("Created At");
                }

                if (["jpg", "jpeg", "png", "gif", "webp"].includes(data.file.file_name.split(".").pop())) {
                    const url = "/static/storage/upload_files" + (data.file.path === "/" ? '' : data.file.path) + "/" + data.file.file_name;
                    $(".file-manager > .flex > section:last-of-type .file-manager__image img").attr("src", url);
                    $(".file-manager > .flex > section:last-of-type .file-manager__image").show();
                }
                else {
                    $(".file-manager > .flex > section:last-of-type .file-manager__image img").attr("src", '');
                    $(".file-manager > .flex > section:last-of-type .file-manager__image").hide();
                }
            }
        }
        catch (error) {
            loadingPopup(2);
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    }

    function uploadFile() {
        const input = $("<input>").attr("type", "file").attr("multiple", "multiple");
        input.click();

        input.on("change", async function () {
            if ($(this)[0].files.length !== 0) {
                loadingPopup(1);
                const fd = new FormData();
                fd.append("path", $(".file-manager > .flex > section:first-of-type ul a.selected").attr("data-path"));
                for (let i = 0; i < $(this)[0].files.length; i++) {
                    fd.append("files[]", $(this)[0].files[i]);
                }
                try {
                    const response = await fetch("/admin/file-manager/upload-file", {
                        method: "POST",
                        body: fd
                    });
                    const data = await response.json();
                    if (data.status === "failed") {
                        loadingPopup(2);
                        setTimeout(() => {
                            warningPopup(...Object.values(data));
                        }, 200);
                    } else {
                        if ($(".file-manager .file-manager__files > span").length === 1) {
                            $(".file-manager .file-manager__files > span").remove();
                            $(".file-manager .file-manager__files").addClass("grid");
                        }
                        for (const file of Object.values(data.files)) {
                            $(".file-manager .file-manager__files").prepend(`
                                <a class="flex column" data-id='${file.id}' data-type='${file.type}'>
                                    <div class="file-manager__files__icon">
                                        ${file.type === "folder" ? '<i class="fa-solid fa-folder"></i>' : '<i class="fa-solid fa-file"></i>'}
                                    </div>
                                    <span>${file.name}</span>
                                </a>
                            `);
                        }
                        loadingPopup(2);
                    }
                }
                catch (error) {
                    loadingPopup(2);
                    setTimeout(function () {
                        warningPopup("serverError", null, true, 5000);
                    }, 200);
                }
                input.remove();
            }
            else {
                input.remove();
            }
        });
    }

    async function deleteFile(id) {
        const fd = new FormData();
        fd.append("id", id);
        try {
            const response = await fetch(`/admin/file-manager/delete-file`, {
                method: "POST",
                body: fd,
            });
            const data = await response.json();
            if (data.status === "failed") {
                loadingPopup(2);
                setTimeout(() => {
                    warningPopup(...Object.values(data));
                }, 200);
            } else {
                const type = $(".file-manager .file-manager__files a.selected").attr("data-type");
                $(".file-manager .file-manager__files a.selected").remove();
                if ($(".file-manager .file-manager__files a").length === 0) {
                    const message = $(".file-manager .file-manager__files").attr("data-no-file-message");
                    $(".file-manager .file-manager__files").removeClass("grid").append("<span>" + message + "</span>");
                }
                if (type === "folder") {
                    const selectedFolderListPath = $(".file-manager > .flex > section:first-of-type a.selected").attr("data-path");
                    await getFolders(selectedFolderListPath);
                }
            }
        }
        catch (error) {
            loadingPopup(2);
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    }

    async function update(fd) {
        try {
            const response = await fetch(`/admin/file-manager/update`, {
                method: "POST",
                body: fd,
            });
            const data = await response.json();
            if (data.status === "failed") {
                loadingPopup(2);
                setTimeout(() => {
                    warningPopup(...Object.values(data));
                }, 200);
            } else {
                const element = $(".file-manager .file-manager__files a.selected");
                element.find("span").text(fd.get("name"));
                if (element.attr("data-type") === "folder") {
                    const selectedFolderListPath = $(".file-manager > .flex > section:first-of-type a.selected").attr("data-path");
                    await getFolders(selectedFolderListPath);
                    await getFiles(selectedFolderListPath);
                }
            }
        }
        catch (error) {
            loadingPopup(2);
            setTimeout(function () {
                warningPopup("serverError", null, true, 5000);
            }, 200);
        }
    }

});