document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const startJeuButton = document.querySelector('#startJeu');
    const noGameSelected = document.querySelector('#noGameSelected');
    const smallImages = document.querySelectorAll('.small');
    const imagePresentation = document.querySelector('.image-presentation img');
    const productPresentationTitle = document.querySelector('.product-presentation h1');
    const productPresentationText = document.querySelector('.product-presentation p');
    let selectedGame = null;
    startJeuButton.disabled = true;



    if (isAuthenticated) {
        authButton.textContent = 'Se déconnecter';
    } else {
        authButton.textContent = 'Connexion';
    }

    function updateButton() {
        startJeuButton.style.display = 'inline-block';
        if (selectedGame && selectedGame !== '' && selectedGame !== null) {
            startJeuButton.disabled = false;
            noGameSelected.style.display = 'none';
        } else {
            startJeuButton.disabled = true;
            noGameSelected.style.display = 'block';
        }
    }




    smallImages.forEach(div => {
        div.addEventListener('click', () => {
            smallImages.forEach(d => d.classList.remove('active'));
            div.classList.add('active');

            selectedGame = div.dataset.game || null;
            updateButton();

            // Animation fade-out
            productPresentationTitle.classList.add('fade-out');
            productPresentationText.classList.add('fade-out');
            imagePresentation.classList.add('fade-out');

            setTimeout(() => {
                if (selectedGame === 'Ratscooter') {
                    imagePresentation.src = 'public/assets/images/Ratscooter/ratscooter_presentation.png';
                    imagePresentation.alt = 'RatsooterPresentation';
                    productPresentationTitle.textContent = 'Ratscooter';
                    productPresentationText.textContent =
                        "Plongez dans l'univers de Ratscooter, un jeu palpitant qui vous tiendra en haleine pendant des heures.\n\n" +
                        "Parcours le plus de plateformes possibles dans la ville de Paris à bord de ton scooter et gare à la chute !\n\n" +
                        "À toi de jouer !";
                } else if (selectedGame === 'TowerDefense') {
                    imagePresentation.src = 'jeux/TOWER_DEFENSE/assets/TowerDefense.png';
                    imagePresentation.alt = 'TowerDefense';
                    productPresentationTitle.textContent = 'Tower Defense';
                    productPresentationText.textContent = "Plongez dans l'univers de Tower Defense, un jeu de stratégie captivant qui mettra vos compétences tactiques à l'épreuve.\n\n" +
                        "Placez vos tours défensives avec intelligence, gérez vos ressources et repoussez les vagues d'ennemis qui menacent votre territoire. Chaque décision compte !\n\n" +
                        "À vous de défendre !";
                } 
                else {
                    imagePresentation.src = 'https://resource.logitechg.com/e_trim/w_600,h_550,c_limit,q_auto:best,f_auto,dpr_auto,d_transparent.gif/content/dam/gaming/en/products/g733/gallery/g733-lilac-gallery-1.png?v=1';
                    imagePresentation.alt = '';
                    productPresentationTitle.textContent = 'Découvrir le jeu d\'une autre façon';
                    productPresentationText.textContent = 'Lorem ipsum dolor sit amet...';
                }

                // Animation fade-in
                productPresentationTitle.classList.remove('fade-out');
                productPresentationText.classList.remove('fade-out');
                imagePresentation.classList.remove('fade-out');

                productPresentationTitle.classList.add('fade-in');
                productPresentationText.classList.add('fade-in');
                imagePresentation.classList.add('fade-in');
            }, 100);
        });
    });




    updateButton();

    // Charger et afficher les scores au chargement de la page
    displayScores();

    const scoresButton = document.querySelector('.scores');
    const secondSection = document.querySelector('.presentation.second');

    scoresButton.addEventListener('click', () => {
        secondSection.scrollIntoView({ behavior: 'smooth' });
    });

    startJeuButton.addEventListener('click', () => {
        if (!selectedGame || selectedGame == null) return;
        const gameRoutes = {
            Ratscooter: '/Ratscooter',
            Jeu2: '/jeu2',
            Jeu3: '/jeu3'
        };
        window.location.href = gameRoutes[selectedGame] || '/';
    });
});

function displayScores() {
    const gameTitles = ["Ratscooter", "Jeu2", "TowerDefense"]; // Liste des jeux
    const divJeux = document.querySelectorAll('.divJeu');

    divJeux.forEach((divJeu, index) => {
        const scoresList = divJeu.querySelector('.scores-list');
        scoresList.innerHTML = ''; // Reinitialiser la liste des scores
        const scoresArray = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const user = JSON.parse(localStorage.getItem(key));

            if (user) {
                const gameName = gameTitles[index]; // Obtenir le nom du jeu
                const score = user.scores && user.scores[gameName] !== undefined ? user.scores[gameName] : 'N/A';
                scoresArray.push({ pseudo: user.pseudo, score: score });
            }
        }

        // Trier scoresArray par ordre décroissant
        scoresArray.sort((a, b) => {
            if (a.score === 'N/A') return 1;
            if (b.score === 'N/A') return -1;
            return b.score - a.score;
        });

        // Afficher les scores des joueurs dans l'ordre
        scoresArray.forEach((user, position) => {
            scoresList.innerHTML += `
            <li>
                <span>${position + 1}. ${user.pseudo}</span>
                <span>${user.score}</span>
            </li>
        `;
        });
    });
}

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

function clearLocalStorageCrazyBowling(){
    localStorage.removeItem("sessionScore");
    localStorage.removeItem("currentRound");
    console.log("bot cleared, sessionScore, currentRound");
}