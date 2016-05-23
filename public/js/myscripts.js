/**
 * Created by oleg on 05.05.2016.
 */
jQuery(document).ready(function($){
  // top menu
  $(".sf-menu").superfish();
  $(".sf-menu").after("<div id='my-menu'>");
  $(".sf-menu").clone().appendTo("#my-menu");
  $("#my-menu").find("*").attr('style', '');
  $("#my-menu").find("ul").removeClass("sf-menu");
  $("#my-menu").mmenu({
    extensions : [ 'widescreen', 'theme-dark', 'pageshadow', 'effect-menu-slide', 'effect-listitems-slide' ],
    navbar: {
      title: "BlueBox"
    }
  });

  var api = $("#my-menu").data("mmenu");
  api.bind("closed", function(){
    $(".toggle-mnu").removeClass("on");
  });

  $(".mobile-mnu").click(function(){
    var mmAPI = $("#my-menu").data("mmenu");
    mmAPI.open();
    var thiss = $(this).find(".toggle-mnu");
    thiss.toggleClass("on");
    $(".main-mnu").slideToggle();
    return false;
  });// end top menu
});