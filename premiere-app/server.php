<?php
  if(isset($_GET['ajax'])) :
    echo "Nous enregistrons ".$_GET['nom']." ".$_GET['prenom']." dans la database";
    exit;
  endif;
  if(isset($_GET['nom'])) :
    print_r($_GET);
    exit;
  endif;

  echo "connecté"; 
  exit; 
?>