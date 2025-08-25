<?php
session_start();
if(!isset($_SESSION['admin'])){
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Área do Admin</title>
</head>
<body>
<h1>Bem-vindo, Admin!</h1>
<p>Aqui você pode criar tópicos da comunidade.</p>
<!-- Aqui você pode incluir seu formulário para criar tópicos -->
<a href="logout.php">Sair</a>
</body>
</html>
