document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('usine_id');

    fetch('../php/get_usines.php')
        .then(function (res) { return res.json(); })
        .then(function (usines) {
            select.innerHTML = '';

            if (usines.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = 'Aucune usine — créez-en une d\'abord';
                select.appendChild(opt);
                return;
            }

            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Sélectionnez votre usine';
            select.appendChild(placeholder);

            usines.forEach(function (usine) {
                const opt = document.createElement('option');
                opt.value = usine.id;
                opt.textContent = usine.nom + ' — ' + usine.region;
                select.appendChild(opt);
            });
        })
        .catch(function () {
            select.innerHTML = '<option value="">Erreur de chargement</option>';
        });

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
        const box = document.createElement('div');
        box.textContent = 'Données enregistrées avec succès.';
        box.style.cssText = `
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #86efac;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 1.5rem;
            font-size: .9rem;
        `;
        const form = document.querySelector('.registration-form');
        form.insertBefore(box, form.firstChild);
    }
});