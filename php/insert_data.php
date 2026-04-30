<?php
require_once 'config.php';
$pdo = getDBConnection();

$usine_id  = $_POST['usine_id'];
$produit   = $_POST['produit'];
$quantite  = $_POST['quantite'];
$unite     = $_POST['unite'];
$date_prod = $_POST['date_prod'];

try {
    $stmt = $pdo->prepare("
        INSERT INTO productions (usine_id, produit, quantite, unite, date_prod)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$usine_id, $produit, $quantite, $unite, $date_prod]);

    header('Location: ../pages/saisie.html?success=1');
    exit;

} catch (PDOException $e) {
    die("ERREUR : " . $e->getMessage());
}