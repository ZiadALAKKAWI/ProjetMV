<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode([]);
    exit;
}

$pdo = getDBConnection();
$stmt = $pdo->query("SELECT id, nom, region, secteur FROM usines ORDER BY nom ASC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
