$(document).ready(function () {



$grid = $('.grid');
$grid.isotope();

$('.filter-button').click(function() {

  var id = $(this).attr('data-filter');

  if (id== '*') {
    $grid.isotope({
      filter: '*'
    });
    return false;
  }
  $grid.isotope({
    filter: id
  });
});

//Get Weather Data
InfoModule.getWeatherByCity("Pittsburgh,us", function(weather){
  var weather = weather.split(" ");
  var currentW;
  var weatherTxt = $('#weather_Txt');
  if (weather.length == 1){
    currentW = weather[0];
  }else{
    currentW = weather[1];
  }
  if (currentW == "clouds"){
    BStageManager.startStage('cloudy');
    weather_Txt.innerHTML = weather_Txt.innerHTML.replace("weather", "cloudy");

  }else if(currentW == "sky"){
    BStageManager.startStage('sunny');
    weather_Txt.innerHTML = weather_Txt.innerHTML.replace("weather", "sunny");

  }else if(currentW == "rain" || currentW == "mist" || currentW == "thunderstorm"){
    BStageManager.startStage('rainy');
    weather_Txt.innerHTML = weather_Txt.innerHTML.replace("weather", "raining");

  }else if (currentW == "snow"){
    BStageManager.startStage('snowy');
    weather_Txt.innerHTML = weather_Txt.innerHTML.replace("weather", "snowing");
  }

});


$('.weather_Toggle').click(function(){
  var stage = $(this).attr('id');
  BStageManager.startStage(stage);
});

// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

});



