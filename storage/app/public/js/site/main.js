// Slider
$(document).ready(function () {
  let warningPopupTimer;
  // Slider
  var currentIndex = 0;
  var items = $(".item");
  var dots = $(".dot");
  var interval;

  function slideTo(index) {
    items.removeClass("current");
    dots.removeClass("current");
    items.eq(index).addClass("current");
    dots.eq(index).addClass("current");
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    slideTo(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    slideTo(currentIndex);
  }

  function startAutoSlide() {
    interval = setInterval(nextSlide, 4000);
  }

  function stopAutoSlide() {
    clearInterval(interval);
  }

  startAutoSlide();

  $(".prev-btn").on("click", function () {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  $(".next-btn").on("click", function () {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  dots.on("click", function () {
    stopAutoSlide();
    var index = $(this).index();
    slideTo(index);
    startAutoSlide();
  });



  // Pagination - News Page
  const boxes = $('.pagination-box');
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const pageInfo = $('#page-info');

  const boxesPerPage = 9;
  let currentPage = 1;
  const totalPages = Math.ceil(boxes.length / boxesPerPage);

  function displayBoxes() {
    // Önce tüm box'ları gizliyoruz
    boxes.hide();

    // Gösterilecek box'ları hesaplıyoruz
    const start = (currentPage - 1) * boxesPerPage;
    const end = start + boxesPerPage;
    const boxesToShow = boxes.slice(start, end);

    // Seçilen box'ları gösteriyoruz
    boxesToShow.show();

    // Sayfa bilgisi güncelleniyor
    pageInfo.text(`Page ${currentPage} of ${totalPages}`);

    prevBtn.prop('disabled', currentPage === 1);
    nextBtn.prop('disabled', currentPage === totalPages);
  }

  nextBtn.click(function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayBoxes();
    }
  });

  prevBtn.click(function () {
    if (currentPage > 1) {
      currentPage--;
      displayBoxes();
    }
  });

  displayBoxes();



  // Language Dropdown 
  $('.language-btn').on('click', function (event) {
    event.preventDefault();
    $('.language-options').fadeToggle(200);
  });

  $(document).on('click', function (event) {
    if (!$(event.target).closest('.language-dropdown').length) {
      $('.language-options').fadeOut(200);
    }
  });

  // Close Warning Popup
  $(".warningPopup").on("click", "svg.fa-xmark", function () {
    if ($(this).attr("data-reload-page") === "true") {
      window.location.href = $(this).attr("data-reload-page-url").replace(/#$/, "");
    }
    else {
      $(".warningPopup").fadeOut(200);
      clearTimeout(warningPopupTimer);
    }
  });

});
function loadingPopup(status) {
  if (status === 1) {
    $(".loadingPopup").fadeIn(200);
  } else {
    $(".loadingPopup").fadeOut(200);
  }
}
function warningPopup(status, message, reloadPage, timeout = 5000, url = window.location.href) {
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
  warningPopupTimer = setTimeout(function () {
    if (reloadPage === true) {
      window.location.href = url;
    }
    else {
      $(".warningPopup").fadeOut(200);
    }
  }, timeout);
  $(".warningPopup").fadeIn(200);
}
