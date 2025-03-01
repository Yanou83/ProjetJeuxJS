import Player from "./Player.js";
import Plateforme from "./Plateforme.js";
import ObjetSouris from "./ObjetSouris.js";
import { initListeners } from "./ecouteurs.js";
import Menu from "./Menu.js";
import { getBestScore, saveBestScore } from "./utils.js";

export default class Game {
    objetsGraphiques = [];
    bonuses = []; // Tableau pour gérer les bonus
    isMovementBlocked = false;  // Contrôle si le mouvement du joueur doit être bloqué
    transitionState = false;
    transitionComplete = false;
    score = 0;
    bestScore = 0;
    boostSpeed = 0; // Variable pour gérer le boost de vitesse
    fallTimer = null; // Chronomètre pour la chute du joueur
    startingPlatformGenerated = false; // Flag pour s'assurer que la première plateforme est générée qu'une fois
    gameStarted = false; // Flag pour vérifier si le jeu a démarré
    gameName = "Ratscooter"; // Nom jeu
    userEmail = sessionStorage.getItem('userEmail'); // Email de l'utilisateur


    constructor(canvas, selectedColor) {
        this.canvas = canvas;
        this.isMovementBlocked = false;
        // état du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
        this.boost = 100; // Valeur initiale du boost
        this.boostActive = false; // Tracker si le boost est actif
        this.currentSpeed = 10; // Vitesse actuelle des plateformes
        this.menu = new Menu(canvas, this); // Initialiser le menu avec référence au jeu
        this.maxSpeed = 20; // Vitesse maximale
        this.speedIncreaseRate = 0.005; // Facteur d'accélération 
        this.elapsedTime = 0; // Temps écoulé en jeu en secondes 
        this.selectedColor = selectedColor;

        this.baseSpacing = 500; // Espacement initial
        this.minSpacing = 600; // Espacement minimal
        this.maxSpacing = 930; // Espacement maximal pour éviter un jeu trop dur
        this.spacingIncreaseRate = 1.5; // Augmentation progressive de l'espacement

        this.floatingScores = []; // Tableau pour stocker les scores flottants
    }

    async init() {
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(400, 295, this.selectedColor); // Le joueur démarre à 500px de la gauche
        this.objetsGraphiques.push(this.player);

        // Un objet qui suit la souris, juste pour tester
        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "transparent");
        this.objetsGraphiques.push(this.objetSouris);

        // Générer la plateforme de démarrage
        this.generateStartingPlatform();

        // Générer les plateformes automatiquement
        this.generatePlatforms();

        // Répéter la génération de plateformes toutes les 1.5 secondes
        setInterval(() => {
            this.generatePlatforms();
        }, 1500);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas, this.menu, this.startGame.bind(this));

        console.log("Game initialisé");

        // Charger tous les assets du jeu avant d'afficher quoi que ce soit
        await this.loadAssets();

        // Dessiner l'état initial du jeu avant le démarrage
        this.drawInitialState();
    }

    // Charger toutes les assets avant de démarrer le jeu
    async loadAssets() {
        const promises = this.objetsGraphiques.map(obj => obj.load ? obj.load() : Promise.resolve());
        const bonusPromises = this.bonuses.map(bonus => bonus ? bonus.load() : Promise.resolve());
        await Promise.all([...promises, ...bonusPromises]);
    }

    // Générer plateforme de départ
    generateStartingPlatform() {
        if (!this.startingPlatformGenerated) {
            const startingPlatform = new Plateforme(400, 370, 10, 350, 500, "brown", true);
            this.objetsGraphiques.push(startingPlatform);
            this.startingPlatformGenerated = true;
        }
    }

    // Génrer les plateformes
    generatePlatforms() {
        const platformTemplates = [
            { y: 370, largeurBarre: 10, hauteurBarre: 350, longueurMin: 190, longueurMax: 300 },
            { y: 500, largeurBarre: 10, hauteurBarre: 225, longueurMin: 190, longueurMax: 300 },
            { y: 430, largeurBarre: 10, hauteurBarre: 420, longueurMin: 200, longueurMax: 300 },
            { y: 400, largeurBarre: 10, hauteurBarre: 300, longueurMin: 220, longueurMax: 300 },
            { y: 450, largeurBarre: 10, hauteurBarre: 275, longueurMin: 200, longueurMax: 300 },
            { y: 480, largeurBarre: 10, hauteurBarre: 350, longueurMin: 190, longueurMax: 300 }
        ];

        let lastPlatform = this.objetsGraphiques
            .filter(obj => obj instanceof Plateforme)
            .reduce((last, current) => (current.x > last.x ? current : last), { x: 600 });

        // Augmentation progressive de l’espacement, limité à `maxSpacing`
        this.baseSpacing = Math.min(this.maxSpacing, this.baseSpacing + this.spacingIncreaseRate);

        let startX = lastPlatform.x + this.baseSpacing;

        for (let i = 0; i < 10; i++) {
            const template = platformTemplates[Math.floor(Math.random() * platformTemplates.length)];

            // Générer une longueur aléatoire dans l'intervalle spécifié
            const longueurBarre = Math.floor(Math.random() * (template.longueurMax - template.longueurMin + 1)) + template.longueurMin;

            const xPosition = startX + i * this.baseSpacing + Math.floor(Math.random() * 100 - 50);

            const plateforme = new Plateforme(
                xPosition,
                template.y,
                template.largeurBarre,
                template.hauteurBarre,
                longueurBarre
            );

            this.objetsGraphiques.push(plateforme);
            this.bonuses.push(plateforme.bonus);
        }
    }

    // Nettoyer les objets hors écran
    removeOffscreenObjects() {
        this.objetsGraphiques = this.objetsGraphiques.filter(obj => obj.x + obj.longueurBarre > 0);
        this.bonuses = this.bonuses.filter(bonus => bonus && bonus.x > 0);
    }



    checkAndGeneratePlatforms() {
        // Vérifier si le joueur atteint la 5ᵉ plateforme
        const plateformeActuelle = this.objetsGraphiques
            .filter(p => p instanceof Plateforme)
            .find(p => this.player.x > p.x && this.player.x < p.x + p.longueurBarre);

        if (plateformeActuelle) {
            const indexPlateforme = this.objetsGraphiques.indexOf(plateformeActuelle);

            if (indexPlateforme >= 5 && !this.newPlatformsAdded) {
                this.newPlatformsAdded = true; // Évite d'ajouter en boucle

                this.generatePlatforms(this.objetsGraphiques.length); // Ajoute 10 nouvelles plateformes

                // Réinitialisation après l'ajout
                setTimeout(() => { this.newPlatformsAdded = false; }, 1000);
            }
        }
    }


    start() {
        console.log("Game démarré");
        this.lastFrameTime = 0;
        this.frameDuration = 1000 / 120; // 120 FPS

        // On démarre une animation à 120 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop(timestamp) {
        if (this.menu.isPaused || !this.gameStarted) {
            return; // Ne pas continuer l'animation si le jeu est en pause ou n'a pas démarré
        }

        const frameTime = timestamp - this.lastFrameTime;
        if (frameTime < this.frameDuration) {
            requestAnimationFrame(this.mainAnimationLoop.bind(this));
            return;
        }

        this.lastFrameTime = timestamp;

        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        this.drawAllObjects();


        // Dessiner l'icône de pause
        this.menu.drawPauseIcon();

        // Dessiner la jauge de boost
        this.drawBoostGauge();

        // Dessiner les flammes si le boost est actif
        if (this.boostActive) {
            this.player.drawFlames(this.ctx);
        }

        // Dessiner le score
        this.drawScore();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        this.drawFloatingScores(); // Dessine les scores flottants

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }


    // Dessiner l'état initial du jeu (avant le démarrage)
    drawInitialState() {
        if (!this.ctx) return; // Vérifier si le contexte est bien initialisé

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner tous les objets du jeu
        this.drawAllObjects();

        // Dessiner l'icône de pause
        this.menu.drawPauseIcon();

        // Dessiner la jauge de boost
        this.drawBoostGauge();

        // Dessiner le bandeau d'instructions
        this.drawBanner();

        // Dessiner le score
        this.drawScore();
    }

    // Dessine le bandeau d'instructions
    drawBanner() {
        this.ctx.save();

        // Dimensions et position du bandeau
        const bannerWidth = 450;
        const bannerHeight = 120;
        const xCenter = this.canvas.width / 2 - bannerWidth / 2;
        const yCenter = this.canvas.height / 2 - bannerHeight / 2;

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Fond sombre semi-transparent
        this.ctx.strokeStyle = "rgba(0, 122, 20, 0.8)"; // Contour lumineux
        this.ctx.lineWidth = 3;

        // Ombre lumineuse
        this.ctx.shadowColor = "rgba(0, 122, 20, 0.5)"; // Effet néon vert
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        // Dessiner le bandeau
        this.ctx.fillRect(xCenter, yCenter, bannerWidth, bannerHeight);
        this.ctx.strokeRect(xCenter, yCenter, bannerWidth, bannerHeight);

        // Enlever les ombres pour le texte
        this.ctx.shadowBlur = 0;

        // Texte principal en blanc
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 22px 'Poppins', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Press ENTER to Start", this.canvas.width / 2, yCenter + 40);

        // Texte secondaire en gris clair
        this.ctx.font = "16px 'Poppins', sans-serif";
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.fillText("SPACE: Jump  |  E: Boost", this.canvas.width / 2, yCenter + 70);

        this.ctx.restore();
    }

    // Dessine les scores du joueur
    drawScore() {
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "center";
        this.bestScore = getBestScore(this.userEmail, this.gameName);
        // Affichage du Meilleur score et du Score
        const bestScoreText = `Record : ${this.bestScore}`;
        const scoreText = `Score : ${this.score}`;

        const xCenter = this.canvas.width / 2;
        const yPosition = 30;

        // Dessine le texte du record
        this.ctx.fillText(bestScoreText, xCenter + 80, yPosition);

        // Dessiner le score en gras
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillText(scoreText, xCenter - 50, yPosition);


        this.ctx.restore();
    }

    resumeGame() {
        // Reprendre l'animation si le jeu n'est plus en pause
        this.mainAnimationLoop();
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => obj.draw(this.ctx));
        this.bonuses.forEach(bonus => {
            if (bonus) {
                bonus.draw(this.ctx); // Dessine les bonus seulement s'ils existent
            }
        });
    }


    // Dessine la jauge de boost
    drawBoostGauge() {
        const gaugeWidth = 200;
        const gaugeHeight = 20;
        const x = this.canvas.width - gaugeWidth - 20;
        const y = 20;

        // Dessine l'arrière-plan de la jauge
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(x, y, gaugeWidth, gaugeHeight);

        // Dessine l'actuel niveau de boost
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(x, y, (this.boost / 100) * gaugeWidth, gaugeHeight);

        // Dessine les bordures de la jauge
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, gaugeWidth, gaugeHeight);
    }

    // Dessine les scores flottants
    drawFloatingScores() {
        this.floatingScores = this.floatingScores.filter(score => {
            this.ctx.save();
            this.ctx.font = "bold 20px Arial";
            this.ctx.fillStyle = `rgba(0, 122, 20, ${score.opacity})`;
            this.ctx.textAlign = "center";
            this.ctx.fillText(score.text, score.x, score.y);
            this.ctx.restore();

            // Animation : déplacer le texte vers le haut et réduire l'opacité
            score.y -= 1; // Monte doucement
            score.opacity -= 0.02; // Diminue l'opacité

            return score.opacity > 0;
        });
    }

    // Regénère la jauge de boost
    regenerateBoost() {
        if (!this.boostActive && this.boost < 100) {
            this.boost += 0.1;
        }
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/90 de seconde

        this.elapsedTime += this.deltaTime; // Suivi du temps de jeu

        // Augmenter progressivement l'espacement des plateformes
        if (this.baseSpacing < this.maxSpacing) {
            this.baseSpacing += this.spacingIncreaseRate;
        }
        // Déplacement du joueur. 
        this.movePlayer();

        // Déplacement des plateformes de droite à gauche
        this.movePlatforms();


        // Vérifier si de nouvelles plateformes doivent être générées
        this.checkAndGeneratePlatforms();

        // on met à jour la position de objetSouris avec la position de la souris
        // Pour un objet qui "suit" la souris mais avec un temps de retard, voir l'exemple
        // du projet "charQuiTire" dans le dossier COURS
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        // Vérifier les collisions avec les bonus
        this.checkBonusCollisions();

        // Regénère la jauge de boost
        this.regenerateBoost();

        // Supprime les objets hors écran
        //this.removeOffscreenObjects();


        // Vérifie si le joueur est tombé de la plateforme
        this.checkFall();
    }

    checkFall() {
        if (this.menu.isPaused) return; // Ne pas vérifier la chute si le jeu est en pause

        if (!this.estSurPlateforme) {
            if (!this.fallTimer) {
                this.fallTimer = setTimeout(() => {
                    if (!this.menu.isPaused) { // Vérifier si le jeu est toujours en pause avant de déclencher gameOver
                        this.gameOver();
                    }
                }, 1000); // 1 seconde
            }
        } else {
            clearTimeout(this.fallTimer);
            this.fallTimer = null;
        }
    }

    gameOver() {
        this.menu.isPaused = true;
        console.log("Game Over - Score Final:", this.score); // Vérifier si le score est bon avant l'affichage du menu

        this.menu.showGameOverMenu(); // Afficher menu Game Over

        if (this.userEmail) {
            saveBestScore(this.score, this.userEmail, this.gameName);
        }
    }

    // Vérifie les collisions avec les bonus pour les supprimer et attribuer les points
    checkBonusCollisions() {
        this.bonuses = this.bonuses.filter(bonus => {
            if (!bonus || bonus.x < this.player.x - 100 || bonus.x > this.player.x + 100) return true; // Ignore les bonus trop loin

            const playerLeft = this.player.x - this.player.w / 2;
            const playerRight = this.player.x + this.player.w / 2;
            const playerTop = this.player.y - this.player.h / 2;
            const playerBottom = this.player.y + this.player.h / 2;

            const bonusLeft = bonus.x;
            const bonusRight = bonus.x + bonus.size;
            const bonusTop = bonus.y;
            const bonusBottom = bonus.y + bonus.size;

            const isColliding = playerRight > bonusLeft && playerLeft < bonusRight && playerBottom > bonusTop && playerTop < bonusBottom;

            if (isColliding) {
                const points = bonus.type === 'green' ? 10 : 30;
                this.score += points;

                // Ajoute un score flottant à la liste
                this.floatingScores.push({
                    x: bonus.x + bonus.size / 2,
                    y: bonus.y,
                    text: `+${points}`,
                    opacity: 1,
                    lifespan: 50 // Durée de vie en frames
                });

                const plateforme = this.objetsGraphiques.find(obj => obj instanceof Plateforme && obj.bonus === bonus);
                if (plateforme) {
                    plateforme.bonus = null; // Supprime le bonus de la plateforme
                }
                return false; // Supprime le bonus du tableau
            }
            return true;
        });
    }


    // Gestion du déplacement du joueur
    movePlayer() {
        if (this.isMovementBlocked) {
            return;  // Arrête la mise à jour du mouvement si bloqué
        }

        // Saut
        this.handleJump();

        if (this.player.y + this.player.h / 2 > this.canvas.height) {
            // Ajouter une condition pour vérifier l'état de transition
            if (this.transitionState && !this.transitionComplete) {
                // Permettre une certaine flexibilité pendant la transition
                this.player.y = Math.min(this.player.y, this.canvas.height - this.player.h / 2);
            } else {
                // Bloquer les mouvements uniquement si la transition est complète ou inexistante
                this.isMovementBlocked = true;
                this.player.y = 1000;
            }
        }
        // Action inclinaison quand la moto s'apprête à tomber
        if (this.transitionState && !this.transitionComplete) {
            if (this.player.angle < Math.PI / 5) {  // Si l'angle est inférieur à la limite de 60% (36 degrés), continuer à incliner
                this.player.angle += 0.05;  // Augmente progressivement l'angle
                this.player.x += 2;  // Déplacement latéral léger pendant l'inclinaison
                this.player.vitesseX = 2;
            } else {
                this.player.x += 10;  // Glissement avant la chute
                // Calculer la nouvelle position y sans dépasser le bas du canvas
                let newY = Math.min(this.canvas.height - this.player.h / 2, this.player.y + 200);
                this.player.y = newY;  // Applique la nouvelle position y
                this.transitionComplete = true;  // Marque la transition comme terminée
            }


            if (this.transitionComplete) {
                this.player.vitesseY = 10;  // Déclenche la chute
            }
        } else {
            this.player.vitesseX = 0;  // Empêche le joueur d'avancer ou de reculer

            if (this.inputStates.Space && this.estSurPlateforme && (this.player.y + this.player.h / 2 >= this.canvas.height)) {
                this.player.vitesseY = -20;  // Augmenter la hauteur de saut
                this.player.vitesseX = 10;  // Augmenter la distance de saut en longueur
                this.player.angle = 0;  // Réinitialiser l'angle en sautant
            } else {
                if (!this.estSurPlateforme) {  // Si pas sur une plateforme, appliquer la gravité
                    this.player.vitesseY += 1;
                }
            }

            this.player.move();
        }

        this.testCollisionsPlayer();
    }


    // Gestion du saut
    handleJump() {
        if (this.inputStates.Space && (this.estSurPlateforme)) {
            this.player.vitesseY = -20;
            this.player.vitesseX = 10;
            this.player.angle = 0;
        } else if (!this.inputStates.Space && this.player.vitesseY < 0) {
            this.player.vitesseY *= 0.8;
        }
    }

    // Gestion du déplacement des plateformes
    movePlatforms() {
        // Augmentation progressive de la vitesse en fonction du temps (linéaire, sans boost)
        if (!this.boostActive && this.currentSpeed < this.maxSpeed) {
            this.currentSpeed += this.speedIncreaseRate; // Progression naturelle
        }

        let targetBoostSpeed = 0; // Vitesse supplémentaire uniquement pour le boost

        // Gestion du boost (temporaire, n'affecte pas la progression normale)
        if (this.inputStates.F && this.boost > 0) {
            targetBoostSpeed = 10; // La vitesse supplémentaire temporaire due au boost
            this.boost -= 0.5; // Décrémente progressivement le boost
            this.boostActive = true;
        } else {
            this.boostActive = false;
        }

        // Transition fluide du boost (smooth start & end)
        this.boostSpeed += (targetBoostSpeed - this.boostSpeed) * 0.1;

        // Vitesse finale appliquée aux plateformes = vitesse normale + boost fluide
        let effectiveSpeed = this.currentSpeed + this.boostSpeed;

        // Appliquer la vitesse aux plateformes
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Plateforme) {
                obj.move(-effectiveSpeed);
            }
        });
    }



    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les Plateformes
        this.testCollisionPlayerPlateformes();
    }

    testCollisionPlayerBordsEcran() {
        if (this.player.x - this.player.w / 2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.player.w / 2;
        }
        if (this.player.x + this.player.w / 2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w / 2;
        }

        if (this.player.y - this.player.h / 2 < 0) {
            this.player.y = this.player.h / 2;
            this.player.vitesseY = 0;
        }
    }


    testCollisionPlayerPlateformes() {
        let estSurPlateformeTemp = false;

        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Plateforme) {
                // Coordonnées du joueur
                let playerLeft = this.player.x - this.player.w / 2;
                let playerRight = this.player.x + this.player.w / 2;
                let playerBottom = this.player.y + this.player.h / 2;
                let playerFutureBottom = playerBottom + this.player.vitesseY;

                // Coordonnées de la plateforme
                let platLeft = obj.x - obj.largeurBarre / 2;
                let platRight = obj.x + obj.largeurBarre / 2;
                let platTop = obj.y;

                // Vérification : est-ce que le joueur chevauche la plateforme ?
                let chevauchePlateforme = playerRight > platLeft && playerLeft < platRight;

                // Vérification : est-ce que le joueur touche la plateforme par le bas ?
                let atterrirSurPlateforme =
                    playerFutureBottom >= platTop && // Le joueur va toucher la plateforme
                    playerBottom <= platTop + Math.abs(this.player.vitesseY) && // Tolérance pour éviter les bugs de détection
                    this.player.vitesseY > 0; // Il doit être en train de descendre

                if (chevauchePlateforme && atterrirSurPlateforme) {
                    this.player.y = platTop - this.player.h / 2; // Pose le joueur sur la plateforme
                    this.player.vitesseY = 0; // Stoppe la chute
                    estSurPlateformeTemp = true; // Marque que le joueur est sur une plateforme

                    // Calculer le pourcentage de la hitbox du joueur sur la plateforme
                    let overlapLeft = Math.max(playerLeft, platLeft);
                    let overlapRight = Math.min(playerRight, platRight);
                    let overlapWidth = overlapRight - overlapLeft;
                    let playerWidth = this.player.w;
                    let overlapPercentage = overlapWidth / playerWidth;

                    // Ajuster l'angle du joueur en fonction du pourcentage de chevauchement
                    if (overlapPercentage >= 0.8) {
                        this.player.angle = 0; // Pas d'inclinaison si 80% ou plus de la hitbox est sur la plateforme
                    } else {
                        let maxInclinaison = Math.PI / 5; // Limite l'angle à environ 36 degrés (~60% de bascule)
                        this.player.angle = ((0.8 - overlapPercentage) / 0.8) * maxInclinaison;

                        // Si l'inclinaison dépasse 77 %, déclencher le glissement
                        if ((1 - overlapPercentage) > 0.77 && !this.transitionComplete) {
                            this.transitionState = true;
                            this.player.x += 10; // Glisser de 10 pixels vers la droite
                        }
                    }


                    // Si inclinaison dépasse 77 %, déclencher le glissement
                    if ((1 - overlapPercentage) > 0.77 && !this.transitionComplete) {
                        this.transitionState = true;
                    }
                }
            }
        });

        // Mise à jour de l'état global
        this.estSurPlateforme = estSurPlateformeTemp;
    }

    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.start();
        }
    }

    resetGame() {
        // Nettoyer les timers actifs pour éviter des doublons
        clearTimeout(this.fallTimer);
        this.fallTimer = null;
        clearInterval(this.platformInterval);

        // Supprimer les objets graphiques pour éviter l’accumulation
        this.objetsGraphiques = [];
        this.bonuses = [];
        this.score = 0;
        this.gameStarted = false;

        // Signaler que le jeu doit être redémarré
        if (this.onGameRestart) {
            this.onGameRestart(); // Appelle `startGame()` dans `script.js`
        }
    }
}