// Слайдер s8 main

$(document).ready(function () {
   $('.section8-container-slider').slick({
      arrows: false,
      dots: true,
      adaptiveHeight: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      speed: 1000,
      easinf: 'ease',
      infinite: true,                     //стоп в слайде
      autoplay: false,
      autoplaySpeed: 1000,
      pauseOnFocus: true,
      pauseOnHover: true,
      pauseOnDotsFocus: true,     //стоп автопроигрования
      draggable: false,
      swipe: true,
      touchThreshold: 10,
      touchMove: true,
      waitForAnimamate:true,
      centerMode:true,
      centerPadding: "10px"
});
})

$(document).ready(function () {
   $('.section2-slider').slick({
      arrows: false,
      dots: true,
      adaptiveHeight: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      speed: 1000,
      easinf: 'ease',
      infinite: false,                     //стоп в слайде
      // autoplay: false,
      // autoplaySpeed: 1000,
      // pauseOnFocus: true,
      // pauseOnHover: true,
      // pauseOnDotsFocus: true,     //стоп автопроигрования
      draggable: false,
      swipe: true,
      // touchThreshold: 10,
      touchMove: true,
      waitForAnimamate:true,
      // centerMode:true,
      variableWidth:false,
});
})

$(document).ready(function () {
   $('.section2-container-slider').slick({
      arrows: false,
      dots: true,
      adaptiveHeight: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      speed: 1000,
      easinf: 'ease',
      infinite: false,                     //стоп в слайде
      // autoplay: false,
      // autoplaySpeed: 1000,
      // pauseOnFocus: true,
      // pauseOnHover: true,
      // pauseOnDotsFocus: true,     //стоп автопроигрования
      draggable: false,
      swipe: true,
      // touchThreshold: 10,
      touchMove: true,
      waitForAnimamate:true,
      // centerMode:true,
      // centerPadding: "370px"
      variableWidth:false,
});
})
