$.mobile.defaultPageTransition = "slideup";

function Geolocalisation() {
   if(document.querySelector("#map")) {
  var optionsGeo = {
    enableHighAccuracy: true,
    timeout: 6000,
    maximumAge: 600
  }
  navigator.geolocation.getCurrentPosition(successGeo, errorGeo, optionsGeo);
   }
}

function successGeo(pos) {
  console.log(pos)
  var crd = pos.coords;
  var text = "positionné en long. : " + crd.longitude + " et lat. : " + crd.latitude;
  $(".ici").html(text);
 
    Main(crd.latitude, crd.longitude);
  
}

function errorGeo(err) {
  console.log(err)
  var text ="[Désolé, pas de géolocalisation possible]"+err.message;
  $(".ici").html(text)
}

//On lance la fonctionnalité si la bonne page est affichée
$(document).delegate('#geo', 'pagecreate', function(){
  Geolocalisation();
});

function Main(latitude, longitude){
  alert(latitude)
  var gosselies = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(document.querySelector('#map'), {
    zoom: 15,
    center: gosselies
  });
  var marker = new google.maps.Marker({
    position: gosselies,
    map: map,
    label: "Cepegra - Forem",
    title: "C'est ouvert!"
  });
}
