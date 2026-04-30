document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get('success') === '1') {
        const box = document.createElement('div');
        box.textContent = 'Usine enregistrée avec succès.';
        box.style.cssText = `
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #86efac;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 1.5rem;
            font-size: .9rem;
        `;
        const form = document.getElementById('usine-form');
        form.insertBefore(box, form.firstChild);
    }
});