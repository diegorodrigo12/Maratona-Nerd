<?php
session_start();

// Defina aqui seu usuário e senha exclusivos
$admin_user = 'seuUsuario';
$admin_pass = 'suaSenhaSegura123';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if($username === $admin_user && $password === $admin_pass){
    $_SESSION['admin'] = true;
    header('Location: admin_area.php');
    exit;
} else {
    $_SESSION['error'] = "Usuário ou senha incorretos!";
    header('Location: login.php');
    exit;
}
?>
