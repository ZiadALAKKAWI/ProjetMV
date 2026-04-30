// ============================================================
// PRODUCT SUGGESTIONS PER SECTOR
// ============================================================
const produitsSecteur = {
    'transport':       ['Colis', 'Palettes', 'Conteneurs', 'Fret'],
    'production':      ['Acier', 'Aluminium', 'Plastique', 'Verre', 'Béton'],
    'distribution':    ['Marchandises générales', 'Produits frais', 'Électronique'],
    'pharmacie':       ['Médicaments', 'Vaccins', 'Équipements médicaux'],
    'agroalimentaire': ['Blé', 'Maïs', 'Sucre', 'Farine', 'Huile végétale'],
    'energie':         ['Électricité (MWh)', 'Gaz naturel', 'Pétrole brut'],
    'autre':           ['Produit A', 'Produit B', 'Produit générique']
};

// ============================================================
// STATE
// ============================================================
let usines       = [];   // all usines loaded from DB
let simulRunning = false;

// ============================================================
// JOURNAL
// ============================================================
function clearJournal() {
    document.getElementById('journal').innerHTML = '';
}

function log(message, type = 'info') {
    const journal = document.getElementById('journal');
    const line    = document.createElement('div');
    const time    = new Date().toLocaleTimeString('fr-FR');
    line.className = 'log-' + type;
    line.textContent = '[' + time + '] ' + message;
    journal.appendChild(line);
    journal.scrollTop = journal.scrollHeight;
}

function logSeparator() {
    const journal = document.getElementById('journal');
    const line    = document.createElement('div');
    line.className = 'log-muted';
    line.textContent = '─'.repeat(48);
    journal.appendChild(line);
    journal.scrollTop = journal.scrollHeight;
}

function logSummary(stats) {
    const journal = document.getElementById('journal');
    const block   = document.createElement('div');
    block.className = 'log-summary';
    block.innerHTML = [
        '📊 RÉSUMÉ DE SIMULATION',
        '  Usines simulées    : ' + stats.usines,
        '  Jours simulés      : ' + stats.jours,
        '  Entrées générées   : ' + stats.entrees,
        '  Pannes déclenchées : ' + stats.pannes,
        '  Pics déclenchés    : ' + stats.pics,
        '  Période couverte   : ' + stats.debut + ' → ' + stats.fin,
        '  Durée totale       : ' + stats.duree + 's'
    ].join('\n');
    journal.appendChild(block);
    journal.scrollTop = journal.scrollHeight;
}

// ============================================================
// PROGRESS BAR
// ============================================================
function setProgress(pct) {
    document.getElementById('progress-wrap').classList.add('visible');
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-label').textContent = Math.round(pct) + '%';
}

function hideProgress() {
    document.getElementById('progress-wrap').classList.remove('visible');
    document.getElementById('progress-bar').style.width = '0%';
}

// ============================================================
// LOAD USINES FROM DB
// ============================================================
async function chargerUsines() {
    try {
        const res    = await fetch('../php/get_all_usines.php');
        usines       = await res.json();
        const list   = document.getElementById('usine-list');

        if (usines.length === 0) {
            list.innerHTML = '<span style="font-family:var(--font-mono);font-size:.75rem;color:var(--gray-400);">Aucune usine trouvée en base.</span>';
            return;
        }

        list.innerHTML = '';
        usines.forEach(function (u) {
            const label       = document.createElement('label');
            const cb          = document.createElement('input');
            cb.type           = 'checkbox';
            cb.value          = u.id;
            cb.dataset.nom    = u.nom;
            cb.dataset.secteur = u.secteur;
            cb.addEventListener('change', onUsineChange);

            const name = document.createTextNode(u.nom + ' — ' + u.region);
            const tag  = document.createElement('span');
            tag.className   = 'usine-tag';
            tag.textContent = u.secteur;

            label.appendChild(cb);
            label.appendChild(name);
            label.appendChild(tag);
            list.appendChild(label);
        });
    } catch (e) {
        log('Erreur de chargement des usines : ' + e.message, 'error');
    }
}

// ============================================================
// USINE SELECTION HELPERS
// ============================================================
function selectAll() {
    document.querySelectorAll('#usine-list input[type="checkbox"]')
        .forEach(function (cb) { cb.checked = true; });
    onUsineChange();
}

function deselectAll() {
    document.querySelectorAll('#usine-list input[type="checkbox"]')
        .forEach(function (cb) { cb.checked = false; });
    onUsineChange();
}

function getSelectedUsines() {
    return Array.from(
        document.querySelectorAll('#usine-list input[type="checkbox"]:checked')
    ).map(function (cb) {
        return {
            id:      parseInt(cb.value),
            nom:     cb.dataset.nom,
            secteur: cb.dataset.secteur
        };
    });
}

function onUsineChange() {
    const selected = getSelectedUsines();
    const count    = selected.length;

    document.getElementById('usine-count').textContent =
        count + ' usine' + (count > 1 ? 's' : '') + ' sélectionnée' + (count > 1 ? 's' : '');

    // Update product suggestions based on selected sectors
    updateSuggestions(selected);
}

// ============================================================
// PRODUCT SUGGESTIONS
// ============================================================
function updateSuggestions(selectedUsines) {
    const container = document.getElementById('suggestions');
    container.innerHTML = '';

    // Gather unique sectors from selected usines
    const sectors = [...new Set(selectedUsines.map(function (u) { return u.secteur; }))];

    // Gather unique product suggestions
    const seen     = new Set();
    const produits = [];
    sectors.forEach(function (s) {
        const list = produitsSecteur[s] || produitsSecteur['autre'];
        list.forEach(function (p) {
            if (!seen.has(p)) { seen.add(p); produits.push(p); }
        });
    });

    if (produits.length === 0) return;

    produits.forEach(function (p) {
        const chip       = document.createElement('button');
        chip.type        = 'button';
        chip.className   = 'suggestion-chip';
        chip.textContent = p;
        chip.addEventListener('click', function () {
            document.getElementById('produit').value = p;
        });
        container.appendChild(chip);
    });
}

// ============================================================
// SET DEFAULT DATES (today − 30 days → today)
// ============================================================
function setDefaultDates() {
    const today    = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    document.getElementById('date-fin').value   = today.toISOString().split('T')[0];
    document.getElementById('date-debut').value = lastMonth.toISOString().split('T')[0];
}

// ============================================================
// MAIN SIMULATION
// ============================================================
async function lancerSimulation() {
    if (simulRunning) return;

    const selectedUsines = getSelectedUsines();
    const produit        = document.getElementById('produit').value.trim();
    const dateDebut      = document.getElementById('date-debut').value;
    const dateFin        = document.getElementById('date-fin').value;
    const moy            = parseFloat(document.getElementById('moy-prod').value);
    const variance       = parseFloat(document.getElementById('variance').value);
    const freqPannes     = parseFloat(document.getElementById('freq-pannes').value);
    const freqPics       = parseFloat(document.getElementById('freq-pics').value);

    // ── Validation ──
    if (selectedUsines.length === 0) {
        log('Veuillez sélectionner au moins une usine.', 'error'); return;
    }
    if (!produit) {
        log('Veuillez saisir un type de produit.', 'error'); return;
    }
    if (!dateDebut || !dateFin) {
        log('Veuillez sélectionner une période.', 'error'); return;
    }
    if (new Date(dateDebut) >= new Date(dateFin)) {
        log('La date de début doit être antérieure à la date de fin.', 'error'); return;
    }

    simulRunning = true;
    const tStart = Date.now();
    clearJournal();
    setProgress(0);

    // Build date array
    const dates  = [];
    const cursor = new Date(dateDebut);
    const end    = new Date(dateFin);
    while (cursor <= end) {
        dates.push(new Date(cursor).toISOString().split('T')[0]);
        cursor.setDate(cursor.getDate() + 1);
    }

    const nbJours  = dates.length;
    const nbUsines = selectedUsines.length;
    const total    = nbUsines * nbJours;

    log('Démarrage de la simulation', 'info');
    log(`${nbUsines} usine(s) × ${nbJours} jours = ${total} entrées à générer`, 'info');
    log(`Produit : ${produit}`, 'info');
    log(`Période : ${dateDebut} → ${dateFin}`, 'info');
    logSeparator();

    const donnees = [];
    let countPannes = 0;
    let countPics   = 0;
    let done        = 0;

    for (const usine of selectedUsines) {
        log(`Génération — ${usine.nom}`, 'info');

        for (let j = 0; j < nbJours; j++) {
            let quantite = moy + (Math.random() - 0.5) * variance * 2;
            quantite    += j * 0.05; // slight growth trend

            if (Math.random() < freqPannes) {
                quantite *= 0.1;
                countPannes++;
                log(`⚠ Panne — ${usine.nom} le ${dates[j]}`, 'warning');
            } else if (Math.random() < freqPics) {
                quantite *= 1.8;
                countPics++;
                log(`↑ Pic — ${usine.nom} le ${dates[j]}`, 'success');
            }

            donnees.push({
                usine_id : usine.id,
                produit  : produit,
                quantite : Math.max(0, quantite).toFixed(2),
                unite    : 'tonnes',
                date_prod: dates[j]
            });

            done++;
            setProgress((done / total) * 90); // 90% for generation, 10% for insert
        }
    }

    logSeparator();
    log(`${donnees.length} entrées générées — envoi en base...`, 'info');

    try {
        const reponse  = await fetch('../php/bulk_insert.php', {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body   : JSON.stringify(donnees)
        });
        const resultat = await reponse.json();
        setProgress(100);

        if (resultat.success) {
            log('Toutes les entrées ont été insérées avec succès.', 'success');
            logSeparator();
            logSummary({
                usines  : nbUsines,
                jours   : nbJours,
                entrees : donnees.length,
                pannes  : countPannes,
                pics    : countPics,
                debut   : dateDebut,
                fin     : dateFin,
                duree   : ((Date.now() - tStart) / 1000).toFixed(2)
            });
        } else {
            log('Erreur d\'insertion : ' + resultat.erreur, 'error');
        }
    } catch (e) {
        log('Erreur réseau : ' + e.message, 'error');
    }

    simulRunning = false;
    setTimeout(hideProgress, 2000);
}

// ============================================================
// DELETE ALL DATA
// ============================================================
function confirmerSuppression() {
    const ok = confirm(
        '⚠️ Attention !\n\n' +
        'Ceci va effacer TOUTES les données de production.\n' +
        'Cette action est irréversible.\n\nConfirmer ?'
    );
    if (ok) supprimerTout();
}

async function supprimerTout() {
    clearJournal();
    log('Suppression de toutes les données...', 'warning');
    try {
        const reponse  = await fetch('../php/bulk_insert.php?action=effacer');
        const resultat = await reponse.json();
        if (resultat.success) {
            log('Base de données vidée avec succès.', 'success');
        } else {
            log('Erreur : ' + resultat.erreur, 'error');
        }
    } catch (e) {
        log('Erreur réseau : ' + e.message, 'error');
    }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    chargerUsines();
    setDefaultDates();
});