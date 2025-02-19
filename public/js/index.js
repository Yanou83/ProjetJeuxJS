document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const authButton = document.getElementById('auth-button');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const startJeuButton = document.querySelector('#startJeu');
    const noGameSelected = document.querySelector('#noGameSelected');
    const smallImages = document.querySelectorAll('.small');
    

    if (isAuthenticated) {
        authButton.textContent = 'Se déconnecter';
    } else {
        authButton.textContent = 'Connexion';
    }

    function updateButton() {
        const selected = Array.from(smallImages).some(div => div.classList.contains('active'));
        if (selected) {
            startJeuButton.textContent = 'Lancer le jeu';
            startJeuButton.style.display = 'inline-block';
            noGameSelected.style.display = 'none';
        } else {
            startJeuButton.style.display = 'none';
            noGameSelected.style.display = 'block';
        }
    }

    smallImages.forEach(div => {
        div.addEventListener('click', () => {
            smallImages.forEach(d => d.classList.remove('active'));
            div.classList.add('active');
            updateButton();
        });
    });

    updateButton();

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
        burger.classList.toggle('cross');
    });

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

    const firstSmallImage = document.querySelector('.small:first-child');

    startJeuButton.addEventListener('click', () => {
        if (firstSmallImage.classList.contains('active')) {
            window.location.href = '/jeu1';
        }
    });
});

function handleAuthButtonClick() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated) {
        sessionStorage.removeItem('isAuthenticated');
        window.location.reload();
    } else {
        window.location.href = '/login';
    }
}