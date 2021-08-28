import {owlCarousel} from '../js/owl.carousel';
import { Select2 } from 'select2';
export function initiateSelect2(){
    $(document).ready(function() {
        $('.select2').select2({
        });
    });
}
export function initiate(){

    $(window).scroll(function() {
        var y = $(window).scrollTop();
        if (y > 0) {
            $(".navbar").addClass('sticky');
        } 
        else {
            $(".navbar").removeClass('sticky');
        }
    });
    
    
   
    
    
    
    $(document).ready(function() {
        $(".expert-carousel").owlCarousel({
            autoWidth:false,
            stagePadding: 0,
            autoplayTimeout: 9000, // time for slides changes
            smartSpeed: 1000, // duration of change of 1 slide
            items: 3,
            singleItem:true,
            loop: false,
            //slideBy:'page',
            autoplay: false,
            margin: 10,
            dots: false,
            touchDrag: false,
            mouseDrag: false,
            nav: true,
            navText: ["<img src='../../assets/images/slider-left-arrow.svg'>","<img src='../../assets/images/slider-right-arrow.svg'>"],
            responsiveClass: true,
            responsive:{
                0:{ // breakpoint from 0 up - small smartphones
                    items:1
                },
                480:{  // breakpoint from 480 up - smartphones // landscape
                    items:1
                },
                768:{ // breakpoint from 768 up - tablets
                    items:2,
                    loop:false
                },
                992:{ // breakpoint from 992 up - desktop
                    items:3,
                    loop:false
                },
                1199:{ // breakpoint from 1199 up - desktop
                    items:4,
                    loop:false
                }
            }
        });
        $(".expert-carousel .owl-dots").addClass("container");
    });
    
    
    $(document).ready(function() {
        $(".video-carousel").owlCarousel({
            autoWidth:false,
            stagePadding: 0,
            autoplayTimeout: 9000, // time for slides changes
            smartSpeed: 1000, // duration of change of 1 slide
            items: 1,
            singleItem:true,
            loop: true,
            //slideBy:'page',
            autoplay: true,
            margin: 0,
            dots: true,
            touchDrag: false,
            mouseDrag: false,
            nav: false
        });
        $(".video-carousel .owl-dots").addClass("container");
    });
    
    
    
    // ===== Scroll to Top ==== 
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 100) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
    $('#return-to-top').click(function() {      // When arrow is clicked
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 500);
    });
    
    
    $(function () {
        $("[data-bs-toggle=tooltip").tooltip();
    })
    
    
    $("#Table_Nav li a").on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
           scrollTop: ($(target).offset().top)
        }, 2000);
    });
    
    
    
    $(function () {
     const realFileBtn = document.getElementById("real-file");
    const customBtn = document.getElementById("custom-button");
    const customTxt = document.getElementById("custom-text");
    if(customBtn){
        customBtn.addEventListener("click", function() {
            realFileBtn.click();
          });
    }
    
    if(realFileBtn){
        realFileBtn.addEventListener("change", function() {
            if (realFileBtn.value) {
              customTxt.innerHTML = realFileBtn.value.match(
                /[\/\\]([\w\d\s\.\-\(\)]+)$/
              )[1];
            } else {
              customTxt.innerHTML = "No file chosen, yet.";
            }
          });
    }
    
    });
}
