<?php
session_start();
include 'config.php'; // connexion à MySQL
$pdo = getDBConnection();

if ($_POST) {
    $email = $_POST['email'];
    $mdp   = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($mdp, $user['mot_de_passe'])) {
        // Connexion réussie !
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role']    = $user['role'];
        $_SESSION['nom']     = $user['nom'];

        // Redirection selon le rôle
        if ($user['role'] === 'admin')    header("Location: ../pages/admin.html");
        elseif ($user['role'] === 'analyste') header("Location: ../pages/analyse.html");
        else header("Location: ../pages/saisie.html");
        exit;
    } else {
        header("Location: ../pages/connexion.html?error=invalid_credentials");
        exit;
    }
}
?>