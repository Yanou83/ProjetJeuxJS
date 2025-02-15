import Player from "./Player.js";
import Plateforme from "./Plateforme.js";
import ObjetSouris from "./ObjetSouris.js";
import { initListeners } from "./ecouteurs.js";
import Menu from "./Menu.js";

export default class Game {
    objetsGraphiques = [];
    bonuses = []; // Tableau pour gérer les bonus
    transitionState = false;
    transitionComplete = false;
    score = 0;

    constructor(canvas) {
        this.canvas = canvas;
        // état du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
        this.boost = 100; // Valeur initiale du boost
        this.boostActive = false; // Tracker si le boost est actif
        this.currentSpeed = 10; // Vitesse actuelle des plateformes
        this.menu = new Menu(canvas, this); // Initialiser le menu avec référence au jeu
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
            { y: 430, largeurBarre: 10, hauteurBarre: 420, longueurBarre: 200, couleur: "yellow" }
        ];

        for (let i = 0; i < 3; i++) {
            const template = platformTemplates[Math.floor(Math.random() * platformTemplates.length)];
            const xPosition = 200 + i * 400 + Math.floor(Math.random() * 200); // Positionner aléatoirement avec un décalage de 200 pixels
            const plateforme = new Plateforme(
                xPosition,
                template.y,
                template.largeurBarre,
                template.hauteurBarre,
                template.longueurBarre,
                template.couleur
            );
            this.objetsGraphiques.push(plateforme);
            this.bonuses.push(plateforme.bonus); // Ajoute uniquement dans this.bonuses
        }
    }

    start() {
        console.log("Game démarré");
        this.lastFrameTime = 0;
        this.frameDuration = 1000 / 90; // 90 FPS

        // On démarre une animation à 90 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop(timestamp) {
        if (this.menu.isPaused) {
            return; // Ne pas continuer l'animation si le jeu est en pause
        }

        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime < this.frameDuration) {
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

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/90 de seconde

        // Déplacement du joueur. 
        this.movePlayer();

        // Déplacement des plateformes de droite à gauche
        this.movePlatforms();

        // on met à jour la position de objetSouris avec la position de la souris
        // Pour un objet qui "suit" la souris mais avec un temps de retard, voir l'exemple
        // du projet "charQuiTire" dans le dossier COURS
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        // Vérifier les collisions avec les bonus
        this.checkBonusCollisions();

        // On regarde si le joueur a atteint la sortie
        // TODO

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
        // Saut
        this.handleJump();
        // Action inclinaison quand la moto s'apprête à tomber
        if (this.transitionState && !this.transitionComplete) {
            // Si l'angle est inférieur à la limite de 60% (36 degrés), continuer à incliner
            if (this.player.angle < Math.PI / 5) {
                this.player.angle += 0.05; // Augmente progressivement l'angle
                this.player.x += 2; // Déplacement latéral léger pendant l'inclinaison
                this.player.vitesseX = 2;
            } else {
                // Glissement avant la chute
                this.player.x += 10; // Glisse de 10 pixels vers la droite
                this.player.y += 200; // Glisse de 10 pixels vers la droite
                this.transitionComplete = true; // Marque la transition comme terminée
            }

            // Une fois la transition complète, on déclenche la chute
            if (this.transitionComplete) {
                this.player.vitesseY = 10; // Déclenche la chute
            }
        } else {
            this.player.vitesseX = 0; // Empêche le joueur d'avancer ou de reculer

            // Autorise le saut si on est sur une plateforme ou au sol
            if (this.inputStates.Space && (this.estSurPlateforme || this.player.y >= this.canvas.height - this.player.h / 2)) {
                this.player.vitesseY = -20; // Augmenter la hauteur de saut
                this.player.vitesseX = 10; // Augmenter la distance de saut en longueur
                this.player.angle = 0; // Réinitialiser l'angle en sautant
            } else if (this.player.y < this.canvas.height - this.player.h / 2) {
                this.player.vitesseY += 1; // Appliquer la gravité
            } else {
                this.player.vitesseY = 0;
                this.player.y = this.canvas.height - this.player.h / 2;
                this.player.angle = 0; // Réinitialiser l'angle à l'atterrissage
            }

            this.player.move();
        }

        this.testCollisionsPlayer();
    }

    // Gestion du saut
    handleJump() {
        if (this.inputStates.Space && (this.estSurPlateforme || this.player.y >= this.canvas.height - this.player.h / 2)) {
            this.player.vitesseY = -20;
            this.player.vitesseX = 10;
            this.player.angle = 0;
        } else if (!this.inputStates.Space && this.player.vitesseY < 0) {
            this.player.vitesseY *= 0.8;
        }
    }

    // Gestion du déplacement des plateformes
    movePlatforms() {
        let targetSpeed = 10; // Vitesse normale des plateformes

        // Boost de vitesse si la touche 'F' est pressée et qu'il reste du boost
        if (this.inputStates.F && this.boost > 0) {
            targetSpeed = 20; // Double la vitesse des plateformes
            this.boost -= 1; // Réduit la jauge de boost
            this.boostActive = true;
        } else {
            this.boostActive = false;
        }

        // Smooth transition pour le boost
        if (this.boostActive) {
            this.currentSpeed += (targetSpeed - this.currentSpeed) * 0.1; // Douce augmentation de la vitesse
        } else {
            this.currentSpeed += (targetSpeed - this.currentSpeed) * 0.05; // Douce diminution de la vitesse
        }

        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Plateforme) {
                obj.move(-this.currentSpeed);

                if (obj.x + obj.largeurBarre / 2 < 0) {
                    obj.x = this.canvas.width + obj.largeurBarre / 2;
                    if (obj.bonus) obj.bonus.x = obj.x;
                }
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

        if (this.player.y + this.player.h / 2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h / 2;
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


                    // Logger le % d'inclinaison
                    console.log(`Inclination percentage: ${(1 - overlapPercentage) * 100}%`);

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