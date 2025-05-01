// Enregistre dans localStorage le meilleur score
function saveBestScore(score, userEmail, gameName) {
    if (!userEmail || !gameName) {
        console.error("Données utilisateur ou jeu invalides pour l'enregistrement du score.");
        return;
    }

    // Récupérer les données de l'utilisateur dans localStorage
    let storedUserData = localStorage.getItem(userEmail);

    if (!storedUserData) {
        console.error(`Utilisateur avec l'email ${userEmail} non trouvé.`);
        return;
    }

    let userData = JSON.parse(storedUserData);

    // Vérifier si le champ `scores` existe, sinon l'initialiser
    if (!userData.scores) {
        userData.scores = {};
    }

    // Ajouter ou mettre à jour le score du jeu
    if (!userData.scores[gameName] || score > userData.scores[gameName]) {
        userData.scores[gameName] = score;

        // Sauvegarde dans localStorage
        localStorage.setItem(userEmail, JSON.stringify(userData));
    }
}


// Récupérer le meilleur score d'un utilisateur pour un jeu spécifique
function getBestScore(userEmail, gameName) {
    if (!userEmail || !gameName) {
        console.error("Données utilisateur ou jeu invalides pour récupérer le score.");
        return 0;
    }

    let storedUserData = localStorage.getItem(userEmail);

    if (!storedUserData) {
        console.warn(`Aucun score trouvé pour l'utilisateur ${userEmail}.`);
        return 0;
    }

    let userData = JSON.parse(storedUserData);
    return userData.scores?.[gameName] || 0;
}

export { saveBestScore, getBestScore };