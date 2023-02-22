// import Swiper JS
// core version + navigation, pagination modules:
console.log(1);
const reviewsSlider = new Swiper('.beta_slider', {
    // Optional parameters
        direction: 'horizontal',
      
        // If we need pagination
        pagination: {
          el: '.beta_swiper-pagination',
          clickable: true
        },
    
});