document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const authButton = document.getElementById('auth-button');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const startJeuButton = document.querySelector('#startJeu');
    const noGameSelected = document.querySelector('#noGameSelected');
    const smallImages = document.querySelectorAll('.small');
    const imagePresentation = document.querySelector('.image-presentation img');
    const firstSmallImage = document.querySelector('.small:first-child');
    const productPresentationTitle = document.querySelector('.product-presentation h1');
    const productPresentationText = document.querySelector('.product-presentation p');
    

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

            if (firstSmallImage.classList.contains('active')) {
                imagePresentation.src = 'public/assets/images/ratscooter_presentation.png';
                imagePresentation.alt = 'RatsooterPresentation';
                productPresentationTitle.textContent = 'Ratsooter';
                productPresentationText.textContent = 'Plongez dans l\'univers de Ratsooter, un jeu palpitant qui vous tiendra en haleine pendant des heures. \n\nParcours le plus de plateformes possibles dans la ville à bord de ton scooter et gare à la chute !\n\nA toi de jouer !';
            } else {
                imagePresentation.src = 'https://resource.logitechg.com/e_trim/w_600,h_550,c_limit,q_auto:best,f_auto,dpr_auto,d_transparent.gif/content/dam/gaming/en/products/g733/gallery/g733-lilac-gallery-1.png?v=1';
                imagePresentation.alt = '';
                productPresentationTitle.textContent = 'Découvrir le jeu d\'une autre façon';
                productPresentationText.textContent = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum odio eos beatae labore possimus. Pariatur ipsa, tempore optio placeat expedita minus cupiditate nulla iure quis error. A vitae quibusdam ipsum dolor sit amet consectetur adipisicing elit.';
            }
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

    startJeuButton.addEventListener('click', () => {
        if (firstSmallImage.classList.contains('active')) {
            const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
            if (isAuthenticated) {
                window.location.href = '/jeu1';
            } else {
                sessionStorage.setItem('redirectAfterLogin', '/jeu1');
                window.location.href = '/login';
            }
        }
    });
});

function handleAuthButtonClick() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated) {
        sessionStorage.removeItem('isAuthenticated');
        window.location.reload();
    } else {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
    }
}