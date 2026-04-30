<?php
require_once 'config.php';
header('Content-Type: application/json');

$pdo = getDBConnection();

// Action: wipe all data
if (isset($_GET['action']) && $_GET['action'] === 'effacer') {
    try {
        $pdo->exec("DELETE FROM productions");
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'erreur' => $e->getMessage()]);
    }
    exit;
}

// Action: bulk insert
$body = file_get_contents('php://input');
$donnees = json_decode($body, true);

if (!$donnees || !is_array($donnees)) {
    echo json_encode(['success' => false, 'erreur' => 'Données invalides']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO productions (usine_id, produit, quantite, unite, date_prod)
        VALUES (:usine_id, :produit, :quantite, :unite, :date_prod)
    ");

    $pdo->beginTransaction();
    foreach ($donnees as $ligne) {
        $stmt->execute([
            ':usine_id'  => $ligne['usine_id'],
            ':produit'   => $ligne['produit'],
            ':quantite'  => $ligne['quantite'],
            ':unite'     => $ligne['unite'],
            ':date_prod' => $ligne['date_prod'],
        ]);
    }
    $pdo->commit();
    echo json_encode(['success' => true, 'inseres' => count($donnees)]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'erreur' => $e->getMessage()]);
}