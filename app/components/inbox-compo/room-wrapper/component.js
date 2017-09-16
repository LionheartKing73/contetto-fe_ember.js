import Ember from 'ember';

const {
    Component,
} = Ember;

export default Component.extend({
  didInsertElement(){
    if ($(window).width() > 768) {
      $("#inbox-container .dropdown-menu").css("display", "block");
    }
    $("#inbox-container #dashboard-screen .dropdown-menu").css("display", "none");
    $("#myBrand #inbox-container .dropdown-menu").click(function() {
      $(".dropdown-menu").css({
        "display": "block"
      });
    });
    var flag = 0;
    $("#myBrand #inbox-container .dropdown-toggle").click(function() {
      if (flag == 0) {
        flag++;
        $("#inbox-container .dropdown-menu").css({
          "display": "block"
        });
      } else {
        flag = 0;
        $("#inbox-container .dropdown-menu").css({
          "display": "none"
        });
      }
    });
    $('#inbox-container .nav-tabs-dropdown').each(function(i, elm) {
        $(elm).text($(elm).next('ul').find('li.active a').text());
    });
    $('#inbox-container .nav-tabs-dropdown').on('click', function(e) {
        e.preventDefault();
         $(e.target).toggleClass('open').next('ul').slideToggle();
    });
    $('#inbox-container #nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
        e.preventDefault();
        $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
    });
  }  
});
