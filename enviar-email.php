<?php
// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = htmlspecialchars($_POST['nome']);
    $email = htmlspecialchars($_POST['email']);
    $mensagem = htmlspecialchars($_POST['mensagem']);

    $para = "tecnoplayhardware@gmail.com"; // <-- coloque seu e-mail aqui
    $assunto = "Mensagem do formulário de contato do site";
    $corpo = "Nome: $nome\n";
    $corpo .= "Email: $email\n";
    $corpo .= "Mensagem:\n$mensagem";

    $cabecalhos = "From: $email\r\n";
    $cabecalhos .= "Reply-To: $email\r\n";

    // Envia o e-mail
    if (mail($para, $assunto, $corpo, $cabecalhos)) {
        header("Location: obrigado.html");
        exit();
    } else {
        echo "Erro ao enviar. Tente novamente mais tarde.";
    }
} else {
    echo "Método inválido.";
}
?>
