<?php
session_start();
include 'conexao.php';

$usuario = $_POST['usuario'] ?? '';
$senha = $_POST['senha'] ?? '';

// Pega o usuário do banco
$stmt = $conn->prepare("SELECT id, senha, admin FROM usuarios WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();

if($stmt->num_rows > 0){
    $stmt->bind_result($id, $hash_senha, $admin);
    $stmt->fetch();

    if(password_verify($senha, $hash_senha)){
        // Login correto
        $_SESSION['usuario_id'] = $id;
        $_SESSION['admin'] = $admin;
        header("Location: forum.php"); // redireciona para o fórum
        exit;
    } else {
        echo "Senha incorreta!";
    }
} else {
    echo "Usuário não encontrado!";
}

$stmt->close();
$conn->close();
?>
