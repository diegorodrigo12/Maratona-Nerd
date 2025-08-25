<?php
$servername = "sqlXXX.epizy.com"; 
$username   = "epiz_12345678";    
$password   = "sua_senha";        
$dbname     = "epiz_12345678_comunidade"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha: " . $conn->connect_error);
}
?>
