<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$pdo = getDBConnection();

$produits = $pdo->query("
    SELECT DISTINCT produit FROM productions ORDER BY produit ASC
")->fetchAll(PDO::FETCH_COLUMN);

$usines = $pdo->query("
    SELECT id, nom, region, secteur FROM usines ORDER BY nom ASC
")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'produits' => $produits,
    'usines'   => $usines
]);