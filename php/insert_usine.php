<?php
session_start();
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../pages/nouvelle_usine.html');
    exit;
}

if (!isset($_SESSION['user_id'])) {
    header('Location: ../pages/connexion.html');
    exit;
}

$pdo = getDBConnection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO usines (nom, region, secteur, user_id)
        VALUES (:nom, :region, :secteur, :user_id)
    ");
    $stmt->execute([
        ':nom'     => $_POST['nom'],
        ':region'  => $_POST['region'],
        ':secteur' => $_POST['secteur'],
        ':user_id' => $_SESSION['user_id']
    ]);

    header('Location: ../pages/nouvelle_usine.html?success=1');
    exit;

} catch (PDOException $e) {
    die("ERREUR : " . $e->getMessage());
}