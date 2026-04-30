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

   git clone https://github.com/ZiadALAKKAWI/ProjetMV/upload xampp/htdocs/ProjetMV

2. Launch XAMPP **as administrator** to avoid permission errors.

3. Start the **Apache** and **MySQL** modules from the XAMPP control panel.
   > If MySQL refuses to start, close and relaunch XAMPP as administrator.

4. Open phpMyAdmin: http://localhost/phpmyadmin

5. Create a database named **VisBD** (encoding: utf8_general_ci).

6. Execute the MySQL commands in the MySQL file on the GitHub in phpMyAdmin.

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

## Technical Notes

- The database connection is centralised in `config.php` via `getDBConnection()`
  with a static connection (single instance per request)
- JavaScript is kept separate from HTML — each page has its own `.js` file
- Always use **http://** instead of https:// to avoid XAMPP SSL errors

---

