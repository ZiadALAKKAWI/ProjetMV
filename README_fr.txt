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

   git clone https://github.com/ZiadALAKKAWI/ProjetMV xampp/htdocs/ProjetMV

2. Lancer XAMPP **en tant qu'administrateur** pour éviter les erreurs de permissions.

3. Démarrer les modules **Apache** et **MySQL** depuis le panneau XAMPP.
   > Si MySQL refuse de démarrer, fermer et relancer XAMPP en administrateur.

4. Ouvrir phpMyAdmin : http://localhost/phpmyadmin

5. Créer une base de données nommée **VisBD** (encodage : utf8_general_ci).

6. Executer les commandes MySQL dans le fichier MySQL dans le GitHub a travers phpMyAdmin

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
- Utiliser **http://** et non https:// pour éviter les erreurs SSL de XAMPP

