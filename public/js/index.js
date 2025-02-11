document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const authButton = document.getElementById('auth-button');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated) {
        authButton.textContent = 'Se déconnecter';
    } else {
        authButton.textContent = 'Connexion';
    }

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
        burger.classList.toggle('cross');
    });

    const smallImages = document.querySelectorAll('.small');

    smallImages.forEach(div => {
        div.addEventListener('click', () => {
            smallImages.forEach(d => d.classList.remove('active'));
            div.classList.add('active');
        });
    });

    const scoresButton = document.querySelector('.scores');
    const secondSection = document.querySelector('.presentation.second');

    scoresButton.addEventListener('click', () => {
        secondSection.scrollIntoView({ behavior: 'smooth' });
    });
});

function handleAuthButtonClick() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated) {
        sessionStorage.removeItem('isAuthenticated');
        window.location.reload();
    } else {
        window.location.href = '../../pages/connexion.html';
    }
}
