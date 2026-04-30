<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT id, nom, region, secteur 
    FROM usines 
    WHERE user_id = ?
    ORDER BY nom ASC
");
$stmt->execute([$_SESSION['user_id']]);
$usines = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($usines);