<?php
include 'conexao.php';

$titulo = $_POST['titulo'];
$conteudo = $_POST['conteudo'];

$sql = "INSERT INTO topicos (titulo, conteudo) VALUES ('$titulo', '$conteudo')";
if ($conn->query($sql) === TRUE) {
    echo "Tópico criado com sucesso! <a href='forum.php'>Voltar</a>";
} else {
    echo "Erro: " . $conn->error;
}

$conn->close();
?>
