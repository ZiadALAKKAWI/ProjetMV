# Main Visible — Logistics Management and Planning System

Inspired by the cybernetic principles of Project Cybersyn, Main Visible is a web-based
logistics supervision platform for entering, simulating and analysing industrial
production data in real time.

---

## Prerequisites

- [XAMPP](https://www.apachefriends.org/index.html) (includes Apache, MySQL, PHP 8.2+)
- A modern browser (Chrome, Firefox, Edge)
- Git

---

## Installation

1. Clone the repository into XAMPP's htdocs folder:

   git clone <repo-url> xampp/htdocs/ProjetMV

2. Launch XAMPP **as administrator** to avoid permission errors.

3. Start the **Apache** and **MySQL** modules from the XAMPP control panel.
   > If MySQL refuses to start, close and relaunch XAMPP as administrator.

4. Open phpMyAdmin: http://localhost/phpmyadmin

5. Create a database named **VisBD** (encoding: utf8_general_ci).

6. Import the provided SQL file (`visbd.sql`) via the **Import** tab in phpMyAdmin.
   This file creates the following tables:
   - `utilisateurs` — user accounts and roles
   - `usines` — factories registered by users
   - `productions` — production data entered manually or via simulation

7. Access the site: http://localhost/ProjetMV/pages/index.html

---

## Project Structure

```
ProjetMV/
├── css/
│   └── styles.css          # Full design system (responsive, CSS variables)
├── js/
│   ├── analyse.js          # Dashboard charts and filters
│   ├── connexion.js        # Login page messages
│   ├── enregistrement.js   # Registration form error messages
│   ├── menu.js             # Mobile hamburger menu (shared across all pages)
│   ├── nouvelle_usine.js   # Feedback for factory creation page
│   ├── saisie.js           # Factory dropdown loading + data entry feedback
│   └── simulation.js       # Admin simulation engine (generation + live log)
├── pages/
│   ├── index.html          # Public home page
│   ├── valeurs.html        # Values page (public)
│   ├── enregistrement.html # Registration (public)
│   ├── connexion.html      # Login (public)
│   ├── saisie.html         # Daily data entry (role: usine)
│   ├── nouvelle_usine.html # Factory creation (role: usine)
│   ├── analyse.html        # Analytics dashboard (role: analyste / admin)
│   └── admin.html          # Bulk data simulation (role: admin)
└── php/
    ├── config.php          # Centralised PDO connection (getDBConnection())
    ├── register.php        # Registration — validation + user insertion
    ├── login.php           # Authentication + session management
    ├── logout.php          # Session destruction
    ├── insert_data.php     # Single production entry insertion
    ├── insert_usine.php    # Factory creation linked to logged-in account
    ├── bulk_insert.php     # Bulk insert + delete (admin simulation)
    ├── get_usines.php      # Factories belonging to the logged-in user (data entry dropdown)
    ├── get_all_usines.php  # All factories (admin only)
    ├── get_filtres.php     # Distinct products + factories for analytics filters
    └── get_productions.php # Filtered production data (charts)
```

---

## User Roles

| Role       | Access                                                  |
|------------|---------------------------------------------------------|
| `usine`    | Daily data entry, factory creation                      |
| `admin`    | Full access + bulk data simulation                      |

Roles are assigned at registration and can be changed manually in phpMyAdmin
(table `utilisateurs`, column `role`).

---

## Admin Test Account

| Field    | Value           |
|----------|-----------------|
| Email    | ADMIN@gmail.com |
| Password | Admin123A       |

---

## Database Schema

```sql

*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
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

---

## Technical Notes

- The database connection is centralised in `config.php` via `getDBConnection()`
  with a static connection (single instance per request)
- JavaScript is kept separate from HTML — each page has its own `.js` file
- The mobile hamburger menu is shared across all pages via `menu.js`
- Always use **http://** instead of https:// to avoid XAMPP SSL errors

---

