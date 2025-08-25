<?php
include 'conexao.php';

$sql = "SELECT id, titulo FROM topicos ORDER BY id DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<ul>";
    while($row = $result->fetch_assoc()) {
        echo "<li><a href='ver_topico.php?id=".$row['id']."'>".$row['titulo']."</a></li>";
    }
    echo "</ul>";
} else {
    echo "<p>Nenhum tópico ainda.</p>";
}

$conn->close();
?>
