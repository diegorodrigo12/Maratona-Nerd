<?php
// Para debugar erros, ative estas linhas temporariamente
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Decodifica JSON recebido
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["erro" => "Dados inválidos ou JSON mal formatado."]);
    exit;
}

// Usa null coalescing operator para evitar warning se a chave não existir
$nome = htmlspecialchars($data["nome"] ?? "");
$comentario = htmlspecialchars($data["comentario"] ?? "");

// Validação simples para evitar salvar vazio
if (empty($nome) || empty($comentario)) {
    http_response_code(400);
    echo json_encode(["erro" => "Nome e comentário são obrigatórios."]);
    exit;
}

// Configurar conexão ao banco
$conn = new mysqli("sql308.infinityfree.com", "if0_39624833", "YX04pGTV5z5G", "if0_39624833_Maratonando");

// Verifica erro na conexão
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na conexão: " . $conn->connect_error]);
    exit;
}

// Prepara query para evitar SQL Injection
$stmt = $conn->prepare("INSERT INTO comentarios (nome, comentario) VALUES (?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro na preparação da consulta: " . $conn->error]);
    exit;
}

$stmt->bind_param("ss", $nome, $comentario);

// Executa e verifica sucesso
if ($stmt->execute()) {
    echo json_encode(["mensagem" => "Comentário salvo com sucesso."]);
} else {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao inserir comentário: " . $stmt->error]);
}

// Fecha conexões
$stmt->close();
$conn->close();
?>
