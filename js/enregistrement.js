document.addEventListener('DOMContentLoaded', function () {

    const params = new URLSearchParams(window.location.search);

    const errorMessages = {
        'passwords_mismatch': 'Les mots de passe ne correspondent pas.',
        'weak_password':      'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.',
        'email_exists':       'Cette adresse email est déjà associée à un compte.',
        'database':           'Une erreur technique est survenue. Veuillez réessayer.'
    };

    const error = params.get('error');
    if (error && errorMessages[error]) {
        const box = document.createElement('div');
        box.textContent = errorMessages[error];
        box.style.cssText = `
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fca5a5;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 1.5rem;
            font-size: .9rem;
            line-height: 1.5;
        `;
        const form = document.getElementById('registration-form');
        form.insertBefore(box, form.firstChild);
    }
});