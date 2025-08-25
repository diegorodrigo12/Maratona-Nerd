<?php
include 'conexao.php';

$id = $_GET['id'];
$sql = "SELECT * FROM topicos WHERE id = $id";
$result = $conn->query($sql);
$topico = $result->fetch_assoc();

echo "<h2>".$topico['titulo']."</h2>";
echo "<p>".$topico['conteudo']."</p>";

echo "<h3>Comentários</h3>";
$sql2 = "SELECT * FROM comentarios WHERE topico_id = $id ORDER BY id DESC";
$result2 = $conn->query($sql2);

if ($result2->num_rows > 0) {
    while($row = $result2->fetch_assoc()) {
        echo "<p>".$row['comentario']." <small>(".$row['data_envio'].")</small></p><hr>";
    }
} else {
    echo "<p>Sem comentários ainda.</p>";
}
?>

<form action="salvar_comentario.php" method="POST">
  <input type="hidden" name="topico_id" value="<?php echo $id; ?>">
  <textarea name="comentario" required></textarea>
  <button type="submit">Enviar comentário</button>
</form>
