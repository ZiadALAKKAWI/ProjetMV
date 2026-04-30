// ============================================================
// STATE
// ============================================================
let chartInstance = null;
let allData       = [];

// Colour palette for multi-usine lines
const COLORS = [
    '#2563eb', '#16a34a', '#dc2626', '#d97706',
    '#7c3aed', '#0891b2', '#db2777', '#65a30d'
];

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    setDefaultDates();
    chargerFiltres().then(function () {
        appliquerFiltres();
    });

    document.getElementById('btn-filtrer').addEventListener('click', appliquerFiltres);
    document.getElementById('btn-reset').addEventListener('click', resetFiltres);
});

// ============================================================
// DEFAULT DATES
// ============================================================
function setDefaultDates() {
    const today     = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    document.getElementById('date-fin').value   = today.toISOString().split('T')[0];
    document.getElementById('date-debut').value = lastMonth.toISOString().split('T')[0];
}

// ============================================================
// LOAD FILTERS FROM DB
// ============================================================
async function chargerFiltres() {
    try {
        const res  = await fetch('../php/get_filtres.php');
        const data = await res.json();

        // Populate product dropdown
        const selectProduit = document.getElementById('filtre-produit');
        selectProduit.innerHTML = '<option value="">Tous les produits</option>';
        data.produits.forEach(function (p) {
            const opt       = document.createElement('option');
            opt.value       = p;
            opt.textContent = p;
            selectProduit.appendChild(opt);
        });

        // Populate usine checkboxes
        const usineList = document.getElementById('filtre-usines');
        usineList.innerHTML = '';
        data.usines.forEach(function (u) {
            const label         = document.createElement('label');
            const cb            = document.createElement('input');
            cb.type             = 'checkbox';
            cb.value            = u.id;
            cb.checked          = true;   // all selected by default
            cb.className        = 'usine-cb';

            const tag           = document.createElement('span');
            tag.className       = 'usine-tag';
            tag.textContent     = u.secteur;

            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + u.nom + ' — ' + u.region + ' '));
            label.appendChild(tag);
            usineList.appendChild(label);
        });

    } catch (e) {
        console.error('Erreur chargement filtres:', e);
    }
}

// ============================================================
// BUILD FETCH URL FROM CURRENT FILTERS
// ============================================================
function buildUrl() {
    const params = new URLSearchParams();

    const produit = document.getElementById('filtre-produit').value;
    if (produit) params.set('produit', produit);

    const debut = document.getElementById('date-debut').value;
    const fin   = document.getElementById('date-fin').value;
    if (debut) params.set('date_debut', debut);
    if (fin)   params.set('date_fin',   fin);

    const selected = Array.from(
        document.querySelectorAll('.usine-cb:checked')
    ).map(function (cb) { return cb.value; });

    if (selected.length > 0) params.set('usines', selected.join(','));

    return '../php/get_productions.php?' + params.toString();
}

// ============================================================
// APPLY FILTERS
// ============================================================
async function appliquerFiltres() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('no-data').style.display = 'none';

    try {
        const res = await fetch(buildUrl());
        allData   = await res.json();

        if (allData.length === 0) {
            document.getElementById('loading').style.display  = 'none';
            document.getElementById('no-data').style.display  = 'block';
            clearChart();
            updateKpis([], []);
            return;
        }

        renderChart(allData);
        updateKpis(allData, detecterAnomalies(allData));

    } catch (e) {
        console.error('Erreur chargement données:', e);
    }

    document.getElementById('loading').style.display = 'none';
}

// ============================================================
// RESET FILTERS
// ============================================================
function resetFiltres() {
    document.getElementById('filtre-produit').value = '';
    setDefaultDates();
    document.querySelectorAll('.usine-cb').forEach(function (cb) {
        cb.checked = true;
    });
    appliquerFiltres();
}

// ============================================================
// RENDER CHART
// ============================================================
function renderChart(data) {
    // Group data by usine
    const usines  = [...new Set(data.map(function (r) { return r.usine_nom; }))];
    const dates   = [...new Set(data.map(function (r) { return r.date_prod; }))].sort();

    const datasets = usines.map(function (nom, i) {
        const usineData = data.filter(function (r) { return r.usine_nom === nom; });
        const dataMap   = {};
        usineData.forEach(function (r) { dataMap[r.date_prod] = parseFloat(r.total_quantite); });

        return {
            label          : nom,
            data           : dates.map(function (d) { return dataMap[d] ?? null; }),
            borderColor    : COLORS[i % COLORS.length],
            backgroundColor: COLORS[i % COLORS.length] + '18',
            fill           : usines.length === 1,
            tension        : 0.3,
            pointRadius    : dates.length > 60 ? 2 : 4,
            spanGaps       : true
        };
    });

    const ctx = document.getElementById('graphPrincipal').getContext('2d');

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: dates, datasets: datasets },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: usines.length > 1 },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            return ctx.dataset.label + ' : ' +
                                (ctx.parsed.y !== null ? ctx.parsed.y.toFixed(2) + ' t' : 'N/A');
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 12,
                        maxRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Quantité (tonnes)' }
                }
            }
        }
    });
}

function clearChart() {
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
}

// ============================================================
// ANOMALY DETECTION
// ============================================================
function detecterAnomalies(data) {
    const total   = data.reduce(function (s, r) { return s + parseFloat(r.total_quantite); }, 0);
    const moyenne = total / data.length;
    return data.filter(function (r) {
        return Math.abs(parseFloat(r.total_quantite) - moyenne) / moyenne > 0.5;
    });
}

// ============================================================
// UPDATE KPIs
// ============================================================
function updateKpis(data, anomalies) {
    if (data.length === 0) {
        document.getElementById('stat-total').textContent    = '—';
        document.getElementById('stat-moyenne').textContent  = '—';
        document.getElementById('stat-anomalies').textContent = '—';
        document.getElementById('anomalies-body').innerHTML  =
            '<tr><td colspan="5">Aucune donnée</td></tr>';
        return;
    }

    const total   = data.reduce(function (s, r) { return s + parseFloat(r.total_quantite); }, 0);
    const moyenne = total / data.length;

    document.getElementById('stat-total').textContent    = total.toFixed(2) + ' t';
    document.getElementById('stat-moyenne').textContent  = moyenne.toFixed(2) + ' t/jour';
    document.getElementById('stat-anomalies').textContent = anomalies.length + ' détectée(s)';

    const tbody = document.getElementById('anomalies-body');
    if (anomalies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Aucune anomalie détectée</td></tr>';
    } else {
        const globalMoy = total / data.length;
        tbody.innerHTML = anomalies.map(function (a) {
            const ecart = ((parseFloat(a.total_quantite) - globalMoy) / globalMoy * 100).toFixed(1);
            const color = ecart > 0 ? '#16a34a' : '#dc2626';
            return '<tr>' +
                '<td>' + a.date_prod + '</td>' +
                '<td>' + a.usine_nom + '</td>' +
                '<td>' + a.produit + '</td>' +
                '<td>' + parseFloat(a.total_quantite).toFixed(2) + ' t</td>' +
                '<td style="color:' + color + '; font-weight:600;">' + (ecart > 0 ? '+' : '') + ecart + '%</td>' +
            '</tr>';
        }).join('');
    }
}