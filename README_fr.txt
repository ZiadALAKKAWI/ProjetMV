README
# Main Visible — Système de Gestion et Planification Logistique

Inspiré des principes cybernétiques du Projet Cybersyn, Main Visible est une 
plateforme web de supervision logistique permettant la saisie, la simulation 
et l'analyse de données de production industrielle en temps réel.

---

## Prérequis

- [XAMPP](https://www.apachefriends.org/fr/index.html) (inclut Apache, MySQL, PHP 8.2+)
- Un navigateur moderne (Chrome, Firefox, Edge)
- Git

---

## Installation

1. Cloner le dépôt dans le dossier htdocs de XAMPP :

   git clone <url-du-repo> xampp/htdocs/ProjetMV

2. Lancer XAMPP **en tant qu'administrateur** pour éviter les erreurs de permissions.

3. Démarrer les modules **Apache** et **MySQL** depuis le panneau XAMPP.
   > Si MySQL refuse de démarrer, fermer et relancer XAMPP en administrateur.

4. Ouvrir phpMyAdmin : http://localhost/phpmyadmin

5. Créer une base de données nommée **VisBD** (encodage : utf8_general_ci).

6. Importer le fichier SQL fourni (`visbd.sql`) via l'onglet **Import** de phpMyAdmin.
   Ce fichier crée les tables suivantes :
   - `utilisateurs` — comptes et rôles utilisateurs
   - `usines` — usines enregistrées par les utilisateurs
   - `productions` — données de production saisies ou simulées

7. Accéder au site : http://localhost/ProjetMV/pages/index.html

---

## Structure du projet

ProjetMV/
├── css/
│   └── styles.css          # Design system complet (responsive, variables CSS)
├── js/
│   ├── analyse.js          # Graphiques et filtres du tableau de bord
│   ├── connexion.js        # Messages de la page de connexion
│   ├── enregistrement.js   # Messages d'erreur du formulaire d'inscription
│   ├── menu.js             # Hamburger menu mobile (partagé entre toutes les pages)
│   ├── nouvelle_usine.js   # Feedback page création d'usine
│   ├── saisie.js           # Chargement du dropdown usines + feedback saisie
│   └── simulation.js       # Moteur de simulation admin (génération + journal)
├── pages/
│   ├── index.html          # Page d'accueil publique
│   ├── valeurs.html        # Page des valeurs (publique)
│   ├── enregistrement.html # Inscription (publique)
│   ├── connexion.html      # Connexion (publique)
│   ├── saisie.html         # Saisie journalière (rôle : usine)
│   ├── nouvelle_usine.html # Création d'usine (rôle : usine)
│   ├── analyse.html        # Tableau de bord analytique (rôle : analyste/admin)
│   └── admin.html          # Simulation de données en masse (rôle : admin)
└── php/
├── config.php          # Connexion PDO centralisée (getDBConnection())
├── register.php        # Inscription — validation + insertion utilisateur
├── login.php           # Authentification + gestion de session
├── logout.php          # Destruction de session
├── insert_data.php     # Insertion d'une entrée de production
├── insert_usine.php    # Création d'une usine liée au compte connecté
├── bulk_insert.php     # Insertion en masse + suppression (simulation admin)
├── get_usines.php      # Usines de l'utilisateur connecté (dropdown saisie)
├── get_all_usines.php  # Toutes les usines (admin uniquement)
├── get_filtres.php     # Produits distincts + usines pour filtres analyse
└── get_productions.php # Données de production filtrées (graphiques)




## Compte de test administrateur

| Champ  | Valeur           |
|--------|------------------|
| Email  | ADMIN@gmail.com  |
| Mot de passe | Admin123A  |



## Notes techniques

- La connexion à la base est centralisée dans `config.php` via `getDBConnection()`avec connexion statique (une seule instance par requête)
- Le JavaScript est séparé du HTML — chaque page a son propre fichier`.js`
- Le menu hamburger mobile est partagé via `menu.js` entre toutes les pages
- Utiliser **http://** et non https:// pour éviter les erreurs SSL de XAMPP

## Commandes MYSQL VisBD

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMESutf8mb4 */;---- Database: ‘visbd‘-------------------------------------------------------------
5
-- Table structure for table ‘productions‘-
CREATE TABLE ‘productions‘ (
‘id‘ int(11) NOT NULL,
‘usine_id‘ int(11) DEFAULT NULL,
‘produit‘ varchar(100) DEFAULT NULL,
‘quantite‘ decimal(12,2) DEFAULT NULL,
‘unite‘ varchar(20) DEFAULT NULL,
‘date_prod‘ date DEFAULT NULL,
‘saisi_le‘ datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;---- Table structure for table ‘utilisateurs‘-
CREATE TABLE ‘utilisateurs‘ (
‘id‘ int(11) NOT NULL,
‘entreprise‘ varchar(100) DEFAULT NULL,
‘prenom‘ varchar(50) DEFAULT NULL,
‘nom‘ varchar(50) DEFAULT NULL,
‘email‘ varchar(100) NOT NULL,
‘mot_de_passe‘ varchar(255) NOT NULL,
‘role‘ enum(’usine’,’analyste’,’admin’) DEFAULT ’usine’,
‘secteur‘ varchar(50) DEFAULT NULL,
‘date_creation‘ datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;---- Dumping data for table ‘utilisateurs‘-
INSERT INTO ‘utilisateurs‘ (‘id‘, ‘entreprise‘, ‘prenom‘, ‘nom‘, ‘email‘, ‘mot_de_passe‘, ‘role‘, ‘secteur‘, ‘date_creation‘) VALUES
(8, ’ADMIN’, ’ADMIN’, ’ADMIN’, ’ADMIN@gmail.com’, ’$2y$10$MT8LNjOPj08W6rTLMws8P.vFcfxYrgmitFYK5z0O5bLqVMBqyiJ9S’, ’admin’, ’autre’, ’2026-04-29 21:44:36’);---- Indexes for dumped tables------ Indexes for table ‘productions‘-
ALTER TABLE ‘productions‘
ADD PRIMARY KEY (‘id‘),
ADD KEY ‘usine_id‘ (‘usine_id‘);-
6
-- Indexes for table ‘usines‘-
ALTER TABLE ‘usines‘
ADD PRIMARY KEY (‘id‘),
ADD KEY ‘user_id‘ (‘user_id‘);---- Indexes for table ‘utilisateurs‘-
ALTER TABLE ‘utilisateurs‘
ADD PRIMARY KEY (‘id‘),
ADD UNIQUE KEY ‘email‘ (‘email‘),
ADD UNIQUE KEY ‘email_2‘ (‘email‘),
ADD UNIQUE KEY ‘email_3‘ (‘email‘);---- AUTO_INCREMENT for dumped tables------ AUTO_INCREMENT for table ‘productions‘-
ALTER TABLE ‘productions‘
MODIFY ‘id‘ int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=594;---- AUTO_INCREMENT for table ‘usines‘-
ALTER TABLE ‘usines‘
MODIFY ‘id‘ int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;---- AUTO_INCREMENT for table ‘utilisateurs‘-
ALTER TABLE ‘utilisateurs‘
MODIFY ‘id‘ int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;---- Constraints for dumped tables------ Constraints for table ‘productions‘-
ALTER TABLE ‘productions‘
ADD CONSTRAINT ‘productions_ibfk_1‘ FOREIGN KEY (‘usine_id‘) REFERENCES ‘usines‘ (‘id‘);-
7
-- Constraints for table ‘usines‘-
ALTER TABLE ‘usines‘
ADD CONSTRAINT ‘usines_ibfk_1‘ FOREIGN KEY (‘user_id‘) REFERENCES ‘utilisateurs‘ (‘id‘);
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
