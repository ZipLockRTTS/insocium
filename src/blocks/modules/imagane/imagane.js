AOS.init();

var time = 2, 
iscroll = false,
idTitle = $('#imagane-title_govno'); // (1)

$(window).scroll(function(){
  if (window.pageYOffset >= $(idTitle).offset().top) { // (2)
    if (!iscroll){
        $('.number').each(function() {
              var
                i = 1,
                num = $(this).data('num'),
                step = 1000 * time / num,
                that = $(this),
                int = setInterval(function() {
                  if (i <= num) {
                    that.html(i);
                  } else {
                    clearInterval(int);
                  }
                  i++;
                }, step);
      });
      iscroll = true;
      } 
  }
});