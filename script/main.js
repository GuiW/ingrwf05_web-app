var online= false;

$.ajax({
  method: "GET",
  url: "server.php",
  timeout:2000,
  success : function(){
    online=true;
    alert('connecté'); 
    Main();
  },
  error : function(){
    Main();
  }
});

Main = function() {
  alert(online);
  $('form').removeClass("hidden");
  if (online == false) {
    if(localStorage.dataUser) {
      myArray = localStorage.dataUser.split("&");

      nomArray = myArray[0].split("=");
      prenomArray = myArray[1].split("=");

      $('[name="nom"]').val(nomArray[1]);
      $('[name="prenom"]').val(prenomArray[1]);
    }

    $("form").on("submit", function(e){
      e.preventDefault();
      myDatas = $(this).serialize();
      localStorage.setItem("dataUser",myDatas)
      alert(myDatas);
  
    });//submit
  }
  else {
    if(localStorage.dataUser) {
      $.ajax({
        method: "GET",
        url: "server.php?ajax&"+localStorage.dataUser,
        timeout:2000,
        success : function(response){
          alert(response);
          localStorage.removeItem("dataUser");
        },
        error : function(errorMsg){
          alert("erreur serveur"+errorMsg);
        }
      });//ajax
    }//if localStorage
  }
} //Main
