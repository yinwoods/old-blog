$(document).ready(function() {
      $("#totop").hide();
      $(function() {
        $(window).scroll(function() {
          if($(this).scrollTop() > 1) {
            $("#totop").fadeIn();
          } else {
            $("#totop").fadeOut();
          }
        });
      });

      $("#totop a").click(function() {
        $("html, body").animate({scrollTop:0}, 800);
        return false;
      });
    });