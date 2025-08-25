<?php
include 'conexao.php';

// Recebe os dados do formulário
$titulo = $_POST['titulo'] ?? '';
$conteudo = $_POST['conteudo'] ?? '';

// Prepared statement para evitar problemas com aspas e segurança
$stmt = $conn->prepare("INSERT INTO topicos (titulo, conteudo) VALUES (?, ?)");
$stmt->bind_param("ss", $titulo, $conteudo);

if ($stmt->execute()) {
    echo "Tópico criado com sucesso! <a href='forum.php'>Voltar</a>";
} else {
    echo "Erro: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
