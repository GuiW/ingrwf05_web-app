$.mobile.defaultPageTransition = "slideup";

function Geolocalisation() {
  var optionsGeo = {
    enableHighAccuracy: true,
    timeout: 6000,
    maximumAge: 600
  }
  navigator.geolocation.getCurrentPosition(successGeo, errorGeo, optionsGeo);
}

function successGeo(pos) {
  console.log(pos)
  var crd = pos.coords;
  var text = "positionné en long. : " + crd.longitude + " et lat. : " + crd.latitude;
  $(".ici").html(text);
}

function errorGeo(err) {
  console.log(err)
  var text ="[Désolé, pas de géolocalisation possible]"+err.message;
  $(".ici").html(text)
}

//On lance la fonctionnalité si la bonne page est affichée
$(document).delegate('#geo', 'pagecreate', function(){
  Geolocalisation();
})
