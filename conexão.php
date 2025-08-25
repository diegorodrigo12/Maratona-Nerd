<?php
$servername = "sqlXXX.epizy.com"; 
$username   = "if0_39624833";    
$password   = "YXO4pGTV5z5G";        
$dbname     = "if0_39624833_comunidade"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha: " . $conn->connect_error);
}
?>
