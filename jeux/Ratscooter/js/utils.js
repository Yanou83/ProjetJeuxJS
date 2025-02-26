function drawCircleImmediat(ctx, x, y, r, color = null) {
    // BONNE PRATIQUE : on sauvegarde le contexte
    // des qu'une fonction ou un bout de code le modifie
    // couleur, épaisseur du trait, systeme de coordonnées etc.
    ctx.save(
        // AUTRE BONNE PRATIQUE : on dessine toujours
        // en 0, 0 !!!! et on utilise les transformations
        // géométriques pour placer le dessin, le tourner, le rescaler
        // etc.
    );

    // AUTRE BONNE PRATIQUE : on dessine toujours
    // en 0, 0 !!!! et on utilise les transformations
    // géométriques pour placer le dessin, le tourner, le rescaler
    // etc.

    if (color != null) {
        ctx.fillStyle = color;
    }
    ctx.beginPath();

    // on translate le systeme de coordonnées pour placer le cercle
    // en x, y
    ctx.translate(x, y);
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // on restore le contexte à la fin
    ctx.restore();
}

function drawGrid(ctx, canvas, nbLignes, nbColonnes, couleur, largeurLignes) {
    // dessine une grille de lignes verticales et horizontales
    // de couleur couleur
    ctx.save();

    ctx.strokeStyle = couleur;
    ctx.lineWidth = largeurLignes;

    let largeurColonnes = canvas.width / nbColonnes;
    let hauteurLignes = canvas.height / nbLignes;

    ctx.beginPath();

    // on dessine les lignes verticales
    for (let i = 1; i < nbColonnes; i++) {
        ctx.moveTo(i * largeurColonnes, 0);
        ctx.lineTo(i * largeurColonnes, canvas.height);
    }

    // on dessine les lignes horizontales
    for (let i = 1; i < nbLignes; i++) {
        ctx.moveTo(0, i * hauteurLignes);
        ctx.lineTo(canvas.width, i * hauteurLignes);
    }

    // gpu call pour dessiner d'un coup toutes les lignes
    ctx.stroke();

    // BONNE PRATIQUE : on restore le contexte à la fin
    ctx.restore();
}

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


export { drawCircleImmediat, drawGrid, saveBestScore, getBestScore };