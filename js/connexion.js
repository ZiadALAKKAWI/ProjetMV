const params = new URLSearchParams(window.location.search);

if (params.get('registered') === 'success') {
    document.getElementById('msg-success').style.display = 'block';
}

 const errorMessages = {
    'invalid_credentials': 'Email ou mot de passe incorrect.',
    'session_expired':     'Votre session a expiré. Veuillez vous reconnecter.'
};

const error = params.get('error');
if (error && errorMessages[error]) {
    const box = document.getElementById('msg-error');
    box.textContent = errorMessages[error];
    box.style.display = 'block';
}