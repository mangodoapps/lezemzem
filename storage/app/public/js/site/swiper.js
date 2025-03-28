$(document).ready(function(){

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 20, 
        loop: true, 
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 3000, 
          disableOnInteraction: false, /* Kullanıcı tıklasa bile otomatik kaydırma devam eder */
        },
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          440: {
            slidesPerView: 1
          },
          768: { 
            slidesPerView: 3
          }
        }
      });

});