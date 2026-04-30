<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$pdo = getDBConnection();

$produit    = $_GET['produit']    ?? '';
$date_debut = $_GET['date_debut'] ?? '';
$date_fin   = $_GET['date_fin']   ?? '';
$usine_ids  = isset($_GET['usines']) && $_GET['usines'] !== ''
              ? explode(',', $_GET['usines'])
              : [];

$where  = ['1=1'];
$params = [];

if ($produit) {
    $where[]            = 'p.produit = :produit';
    $params[':produit'] = $produit;
}

if ($date_debut) {
    $where[]               = 'p.date_prod >= :date_debut';
    $params[':date_debut'] = $date_debut;
}

if ($date_fin) {
    $where[]             = 'p.date_prod <= :date_fin';
    $params[':date_fin'] = $date_fin;
}

if (!empty($usine_ids)) {
    $namedPlaceholders = [];
    foreach ($usine_ids as $i => $id) {
        $key                = ':usine_' . $i;
        $namedPlaceholders[] = $key;
        $params[$key]       = (int) $id;
    }
    $where[] = 'p.usine_id IN (' . implode(',', $namedPlaceholders) . ')';
}

$sql = "
    SELECT
        p.date_prod,
        p.usine_id,
        u.nom        AS usine_nom,
        p.produit,
        SUM(p.quantite) AS total_quantite
    FROM productions p
    JOIN usines u ON p.usine_id = u.id
    WHERE " . implode(' AND ', $where) . "
    GROUP BY p.date_prod, p.usine_id, u.nom, p.produit
    ORDER BY p.date_prod ASC
";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}