import Player from "./Player.js";
import Plateforme from "./Plateforme.js";
import ObjetSouris from "./ObjetSouris.js";
import { initListeners } from "./ecouteurs.js";
import Menu from "./Menu.js";

export default class Game {
    objetsGraphiques = [];
    bonuses = []; // Tableau pour gérer les bonus
    isMovementBlocked = false;  // Contrôle si le mouvement du joueur doit être bloqué
    transitionState = false;
    transitionComplete = false;
    score = 0;
    boostSpeed = 0; // Variable to track the current boost speed
    fallTimer = null; // Chronomètre pour la chute du joueur


    constructor(canvas) {
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

        this.baseSpacing = 500; // Espacement initial
        this.minSpacing = 600; // Espacement minimal
        this.maxSpacing = 1000; // Espacement maximal pour éviter un jeu trop dur
        this.spacingIncreaseRate = 0.2; // Augmentation progressive de l'espacement
    }

    async init() {
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(400, 100); // Le joueur démarre à 500px de la gauche
        this.objetsGraphiques.push(this.player);

        // Un objet qui suit la souris, juste pour tester
        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "transparent");
        this.objetsGraphiques.push(this.objetSouris);

        // Générer les plateformes automatiquement
        this.generatePlatforms();

        // Répéter la génération de plateformes toutes les 5 secondes
        setInterval(() => {
            this.generatePlatforms();
        }, 1000);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas, this.menu);

        console.log("Game initialisé");
    }

    // Charger toutes les assets avant de démarrer le jeu
    async loadAssets() {
        const promises = this.objetsGraphiques.map(obj => obj.load ? obj.load() : Promise.resolve());
        await Promise.all(promises);
    }

    generatePlatforms() {
        const platformTemplates = [
            { y: 370, largeurBarre: 10, hauteurBarre: 350, longueurBarre: 200, couleur: "red" },
            { y: 500, largeurBarre: 10, hauteurBarre: 225, longueurBarre: 200, couleur: "blue" },
            { y: 430, largeurBarre: 10, hauteurBarre: 420, longueurBarre: 200, couleur: "yellow" },
            { y: 400, largeurBarre: 10, hauteurBarre: 300, longueurBarre: 250, couleur: "green" },
            { y: 450, largeurBarre: 10, hauteurBarre: 275, longueurBarre: 220, couleur: "purple" },
            { y: 480, largeurBarre: 10, hauteurBarre: 350, longueurBarre: 190, couleur: "orange" }
        ];

        let lastPlatform = this.objetsGraphiques
            .filter(obj => obj instanceof Plateforme)
            .reduce((last, current) => (current.x > last.x ? current : last), { x: 200 });

        // Augmentation progressive de l’espacement, limité à `maxSpacing`
        this.baseSpacing = Math.min(this.maxSpacing, this.baseSpacing + this.spacingIncreaseRate);

        let startX = lastPlatform.x + this.baseSpacing;

        for (let i = 0; i < 10; i++) {
            const template = platformTemplates[Math.floor(Math.random() * platformTemplates.length)];
            const xPosition = startX + i * this.baseSpacing + Math.floor(Math.random() * 100 - 50);

            const plateforme = new Plateforme(
                xPosition,
                template.y,
                template.largeurBarre,
                template.hauteurBarre,
                template.longueurBarre,
                template.couleur
            );

            this.objetsGraphiques.push(plateforme);
            this.bonuses.push(plateforme.bonus);
        }
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
        if (this.menu.isPaused) {
            return; // Ne pas continuer l'animation si le jeu est en pause
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
        // ici on dessine le monstre
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

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    // Dessine le score du joueur
    drawScore() {
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 30);
        this.ctx.restore();
    }

    resumeGame() {
        // Reprendre l'animation si le jeu n'est plus en pause
        this.mainAnimationLoop();
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => obj.draw(this.ctx));
        this.bonuses.forEach(bonus => bonus.draw(this.ctx)); // Dessine les bonus
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

        // Vérifie si le joueur est tombé de la plateforme
        this.checkFall();
    }

    checkFall() {
        if (!this.estSurPlateforme) {
            if (!this.fallTimer) {
                this.fallTimer = setTimeout(() => {
                    this.gameOver();
                }, 1700); // 1,5 secondes
            }
        } else {
            clearTimeout(this.fallTimer);
            this.fallTimer = null;
        }
    }

    gameOver() {
        this.menu.isPaused = true;
        this.menu.showGameOverMenu(); // Display game over menu
    }

    // Vérifie les collisions avec les bonus pour les supprimer et attribuer les points
    checkBonusCollisions() {
        this.bonuses = this.bonuses.filter(bonus => {
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
                this.score += bonus.type === 'green' ? 1 : 3;

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
        // Rappel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
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
}