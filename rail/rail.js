//VARIABLES
var rayon = 10;
var etat = "offline";
var idGare = "";
var posLat = "";
var posLong = "";
var latMax = "";
var latMin = "";
var longMax = "";
var longMin = "";


/******************************************************************************/

//GEOLOCALISATION
function Geolocalisation() {
  var optionsGeo = {
    enableHighAccuracy: true,
    timeout: 12000, //Durée avant affichage d'erreur
    maximumAge: 600 //Durée de mise en cache de la position
  }
  navigator.geolocation.getCurrentPosition(successGeo, errorGeo, optionsGeo);
}

function successGeo(pos) {
  var crd = pos.coords;
  console.log("Latitude : "+crd.latitude)
  console.log("Latitude : "+crd.longitude)
  posLat = crd.latitude;
  posLong = crd.longitude;
  CalculCoordo(crd);
}

function errorGeo(err) {
  console.log(err)
}

//Algorithme de calcul de la long et lat min et max
function CalculCoordo (crd){
  //Calcul rayon 5 kms
  //lat 1° => 111km donc 5kms représentent 1/111*5 degrés;
  ratio_lat = 1/111*rayon;
  latMin = crd.latitude - ratio_lat;
  latMax = crd.latitude + ratio_lat;
  console.log("lat : "+latMin+"/"+latMax);
  //long 1° = 5*111*Math.cos(lat_actuelle);
  ratio_long = rayon/111*Math.cos(crd.latitude);
  longMin = crd.longitude - ratio_long;
  longMax = crd.longitude + ratio_long;
  console.log("long : "+longMin+"/"+longMax);
  listingStations();
}

/******************************************************************************/


//Création/ouverture de la DB
//La var db contient une fonction qui a comme paramètre le nom de db, la version, un nom "usuel", une taille maximum en octet
var db = openDatabase('gares', 1.0, 'Les gares', 2*1024)

//Requête pour aller chercher la liste des gares
function ConnectionApiGares() {
  var myConnection = $.getJSON('https://api.irail.be/stations/?format=json',function(stations){
    // console.log(stations.station);
    etat="online";
    synchronisation(db,stations.station);
  })
  .fail(function() {
    console.log("offline")
  })
}

//Synchronisation entre la DB et la liste des gares
function synchronisation(db, stations) {
  //Transaction entre la DB et le javascript / tx représente la transaction actuelle
  db.transaction(function(tx) {
    //Delete de la table
    tx.executeSql('DROP TABLE stations')
  });

  db.transaction(function(tx) {
    //Création de la table
    tx.executeSql('CREATE TABLE IF NOT EXISTS stations (id unique, standardname, locationX, locationY, id_sncb)');

    //Boucler array Json
    i=1;
    for(station of stations){
      //Insertion du standardname dans la table
      sql = 'INSERT INTO stations (id, standardname, locationX, locationY, id_sncb) VALUES ('+i+', "'+station.standardname+'", "'+station.locationX+'", "'+station.locationY+'", "'+station.id+'")';
      tx.executeSql(sql);
      i++;
    };
  });
  listingStations();
}

function listingStations() {
  db.transaction(function(tx){
    if(longMin > 0) {
      where = 'WHERE (locationY BETWEEN "'+latMin+'" AND "'+latMax+'") AND (locationX BETWEEN "'+longMin+'" AND "'+longMax+'")'
    }
    else {
      where = "";
    }
    //On sélectionne tous les éléments de la table station et on les trie par nom
    sql = 'SELECT * FROM stations '+where+' ORDER BY standardname'
    alert(sql);
    //On repasse tx dans cette deuxième fonction callback pour pouvoir l'utiliser à l'intérieur
    tx.executeSql(sql, [], function(tx, results){
      // console.log(results)
      nombre = results.rows.length;
      console.log(nombre)
      texte= "";

      for(i=0; i<nombre; i++) {
        texte += '<li id="'+results.rows.item(i).standardname+'"><a href="trains.html">'+results.rows.item(i).standardname+'</a></li>'
      }

      $("#listeGares").html(texte);
      $("#listeGares").listview('refresh');
      $("#listeGares li").on("click", function(){
        idGare = $(this).attr('id');
        //alert(idGare);
      })
    });
  })
}

function ConnectionApiTrains() {
  url = "https://api.irail.be/liveboard/?station="+idGare+"&fast=true&format=json";
  var myConnection = $.getJSON(url,function(trains){
    if(trains.departures) {
      departs = trains.departures.departure;
      texte = "";
      for(depart of departs) {
        console.log("Canceled : "+depart.canceled)
        texte += (depart.canceled == 1) ? '<div data-role="collapsible">' : '<div data-role="collapsible" class="annulation">';
        texte += '<h3>'+depart.station+'</h3>';
        texte += '<p>Heure prévue : '+depart.time+'</p>';
        texte += '<p>Retard : '+depart.delay+'</p>';
        texte += '<p>Quai : '+depart.platform+'</p>';
        texte += '</div>'
      }//for
      $("#listeTrains").html(texte);
      $("#gareName").html(idGare);
      $("#listeTrains").trigger("create");
    }//if number
    else {
      $("#listeTrains").html("Désolé, pas d'infos disponible.");
    }
  })
  .fail(function(err) {
    console.log(err);
  })
}

$(document).delegate('#listing', 'pagecreate', function(){
  ConnectionApiGares();
});

$(document).delegate('#trains', 'pagecreate', function(){
  ConnectionApiTrains();
});

$(document).delegate('#accueil', 'pagecreate', function(){
  Geolocalisation();
});
