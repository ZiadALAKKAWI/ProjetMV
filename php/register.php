<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../pages/enregistrement.html');
    exit;
}

// Validate passwords match
if ($_POST['password'] !== $_POST['confirm-password']) {
    header('Location: ../pages/enregistrement.html?error=passwords_mismatch');
    exit;
}

// Validate password strength
$password = $_POST['password'];
if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
    header('Location: ../pages/enregistrement.html?error=weak_password');
    exit;
}

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Prepare data
$newsletter = isset($_POST['newsletter']) ? 1 : 0;
try {
    $pdo = getDBConnection();
    
    $sql = "INSERT INTO utilisateurs (entreprise, prenom, nom, email, mot_de_passe, secteur) 
            VALUES (:entreprise, :prenom, :nom, :email, :mot_de_passe, :secteur)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':entreprise'   => $_POST['entreprise'],
        ':prenom'       => $_POST['prenom'],
        ':nom'          => $_POST['nom'],
        ':email'        => $_POST['email'],
        ':mot_de_passe' => $password_hash,
        ':secteur'      => $_POST['secteur'],
    ]);
    
    header('Location: ../pages/connexion.html?registered=success');
    exit;

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        header('Location: ../pages/enregistrement.html?error=email_exists');
    } else {
        die("DATABASE ERROR: " . $e->getMessage());
    }
    exit;
}
?>