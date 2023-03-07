let p = window.innerHeight/2;
let n = window.innerHeight/2.5;
let elemAnimation1 = document.querySelector('.test_title1');
let elemAnimation2 = document.querySelector('.test_title2');
let elemAnimation3 = document.querySelector('.test_title3');
let elemAnimation4 = document.querySelector('.test_title4');
let elemAnimation5 = document.querySelector('.test_title5');




    $(window).scroll(function(){
        let el1 = elemAnimation1.getBoundingClientRect().y;
        let el2 = elemAnimation2.getBoundingClientRect().y;
        let el3 = elemAnimation3.getBoundingClientRect().y;
        let el4 = elemAnimation4.getBoundingClientRect().y;
        let el5 = elemAnimation5.getBoundingClientRect().y;
        if (p >= el1 && n <= el1) {
            // console.log(123);
            $(elemAnimation1).addClass('element-show');
        }
        else {
            $(elemAnimation1).removeClass('element-show');
        }
        if (p >= el2 && n <= el2) {
            // console.log(123);
            $(elemAnimation2).addClass('element-show');
        }
        else {
            $(elemAnimation2).removeClass('element-show');
        }
        if (p >= el3 && n <= el3) {
            // console.log(123);
            $(elemAnimation3).addClass('element-show');
        }
        else {
            $(elemAnimation3).removeClass('element-show');
        }
        if (p >= el4 && n <= el4) {
            // console.log(123);
            $(elemAnimation4).addClass('element-show');
        }
        else {
            $(elemAnimation4).removeClass('element-show');
        }
        if (p >= el5 && n <= el5) {
            // console.log(123);
            $(elemAnimation5).addClass('element-show');
        }
        else {
            $(elemAnimation5).removeClass('element-show');
        }
    });