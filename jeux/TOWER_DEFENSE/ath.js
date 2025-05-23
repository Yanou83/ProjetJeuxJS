//classe ath pour mon jeux
class GameAth {
    constructor(game) {
        this.game = game;

        // Récupération des éléments HTML header ATH
        this.livesElement = document.getElementById("lives");
        this.moneyElement = document.getElementById("money");
        this.waveElement = document.getElementById("wave");

        // Bouton de paramètres
        this.exitButton = document.getElementById("exit");
        this.exitButton.addEventListener('click', () => this.game.menu.exitButton());

        // Récupération des éléments HTML footer ATH (shop)
        this.towerShopContainer = document.getElementById("tower-shop");
        this.towerShopHeight = 60; // Modifier la hauteur des images des tours ici
        this.selectedTowerElement = null; // stocker l'élément de la tour sélectionnée
        this.selectedTowerData = null; // stocker les données de la tour sélectionnée
        this.game.currentWave = 0;

        this.initializeAth();
    }
    
    initializeAth() {
        // console.log("initialize Ath")
        this.updateHeaderATH();
        this.updateTowerShop();
    }

    updateHeaderATH() {
        // console.log("updateHeaderATH")
        this.livesElement.textContent = this.game.lives;
        this.moneyElement.textContent = this.game.money;
        this.waveElement.textContent = this.game.currentWave;
    }

    updateTowerShop(){
        // console.log("updateTowerShop")
        this.towerShopContainer.innerHTML = '';
        for (const [key, towerData] of Object.entries(towerTypes)) {
            // Créations des tours pour le shop ici car pas vraiment des object de types tours 
            const towerElement = document.createElement('div');
            towerElement.className = 'tower-item';
            towerElement.innerHTML = `
            <div class="tower-on-shop">
                <div class="tower-img"><img src="${towerData.shopImage}" style="height: ${this.towerShopHeight}px; width: auto;"></div>
                <div class="tower-info">
                    <div class="tower-name">${towerData.name}</div>
                    <div class="tower-cost">Coût: ${towerData.cost}</div>
                </div>
            </div>
            `;
            // Evènement sur chaque tour du shop
            // Ajout des événements pour afficher/masquer le tooltip
            towerElement.addEventListener('mouseenter', () => this.showTowerTooltip(towerElement, towerData));
            towerElement.addEventListener('mouseleave', () => this.hideTowerTooltip());

            // Ajout de l'événement pour sélectionner la tour
            towerElement.addEventListener('click', () => this.selectTower(towerData, towerElement));        
            
            this.towerShopContainer.appendChild(towerElement);
        }

        // Ajout d'un écouteur global qui vérifie les clics en dehors de la tour sélectionnée
        document.addEventListener('click', (event) => {
            if (this.selectedTowerElement && this.selectedTowerElement.contains(event.target)) {
                // Le clic est sur la tour sélectionnée => ne rien faire
                return;
            }
            // Sinon tout déselectionner
            this.unselectTower();
        });
    }

    showTowerTooltip(element, towerData) {
        // Supprimer tout tooltip existant
        this.hideTowerTooltip();
        
        // Créer le tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tower-tooltip';
        
        // Contenu du tooltip
        let tooltipContent = `
            <h3>${towerData.name}</h3>
            <div>Dégâts: ${towerData.bullet.damage}</div>
            <div>Portée: ${towerData.range}</div>
            <div>Cadence: ${towerData.fireRate}ms</div>
        `;
        
        tooltip.innerHTML = tooltipContent;
        
        // Positionner le tooltip au-dessus de l'élément
        const rect = element.getBoundingClientRect();// Récup des infos de position
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left}px`; // Positionner le tooltip à gauche de l'élément
        tooltip.style.bottom = `${window.innerHeight - rect.top + 25}px`;
        
        // Ajouter le tooltip au document
        document.body.appendChild(tooltip);
    }

    
    hideTowerTooltip() {
        // Supprimer tous les tooltips existants
        const tooltips = document.querySelectorAll('.tower-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    selectTower(towerData, element) {
        this.game.audio.playSound("selectTower",0.7);
        // Désélectionner toutes les tours avant de sélectionner la nouvelle
        this.unselectTower();
        const towerContainer = element.querySelector('.tower-on-shop');
        if (towerContainer) {
            towerContainer.style.textDecoration = "underline";
            towerContainer.style.textDecorationThickness = "2px";
            towerContainer.style.textUnderlineOffset = "4px";
            towerContainer.style.textDecorationStyle = "solid";
            
            // Stocker la référence de la tour sélectionnée
            this.selectedTowerElement = towerContainer;
            this.selectedTowerData = towerData;
        }
    }

    unselectTower(){
        this.selectedTowerElement = null;
        this.selectedTowerData = null;

        // Réinitialiser les styles de toutes les tours
        const towerElements = document.querySelectorAll('.tower-on-shop');
        towerElements.forEach(el => {
            el.style.textDecoration = "";
            el.style.textDecorationThickness = "";
            el.style.textUnderlineOffset = "";
            el.style.textDecorationStyle = "";
        });
    }

    // Notification pour le joueur 
    notify(message){
        const notification = document.getElementById("notif");
        notification.textContent = message;
        notification.style.opacity = 1;
        setTimeout(() => {
            notification.style.opacity = 0;
        }, 3000);
    }
}
