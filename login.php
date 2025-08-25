<?php session_start(); ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Login Admin</title>
</head>
<body>
<h2>Login Administrador</h2>
<form action="login_process.php" method="POST">
    <label>Usuário:</label>
    <input type="text" name="username" required><br><br>
    <label>Senha:</label>
    <input type="password" name="password" required><br><br>
    <button type="submit">Entrar</button>
</form>
<?php
if(isset($_SESSION['error'])){
    echo "<p style='color:red'>".$_SESSION['error']."</p>";
    unset($_SESSION['error']);
}
?>
</body>
</html>
