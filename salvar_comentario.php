<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$nome = htmlspecialchars($data["nome"]);
$comentario = htmlspecialchars($data["comentario"]);

$conn = new mysqli("sql308.infinityfree.com", "if0_39624833", "YX04pGTV5z5G", "if0_39624833_Maratonando");

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["erro" => "Erro na conexão: " . $conn->connect_error]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO comentarios (nome, comentario) VALUES (?, ?)");
$stmt->bind_param("ss", $nome, $comentario);

if ($stmt->execute()) {
  echo json_encode(["mensagem" => "Comentário salvo com sucesso."]);
} else {
  http_response_code(500);
  echo json_encode(["erro" => "Erro ao inserir comentário."]);
}
?>
