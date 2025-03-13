//classe ath pour mon jeux
class GameAth {
    constructor(game) {
        this.game = game;

        // Récupération des éléments HTML header ATH
        this.livesElement = document.getElementById("lives");
        this.moneyElement = document.getElementById("money");
        this.waveElement = document.getElementById("wave");

        // this.startWaveButton = document.getElementById("start-wave");
        this.exitButton = document.getElementById("exit");
        this.exitButton.addEventListener('click', () => this.game.menu.exitButton());

        // Récupération des éléments HTML footer ATH (shop)
        this.towerShopContainer = document.getElementById("tower-shop");
        this.towerShopHeight = 60; // On peut modifier la hauteur des images des tours ici
        this.selectedTowerElement = null; // Propriété pour stocker l'élément de la tour sélectionnée
        this.selectedTowerData = null; // Propriété pour stocker les données de la tour sélectionnée
        this.game.currentWave = 0;

        this.initializeAth();
    }
    
    initializeAth() {
        console.log("initialize Ath")
        this.updateHeaderATH();
        this.updateTowerShop();
    }

    updateHeaderATH() {
        console.log("updateHeaderATH")
        this.livesElement.textContent = this.game.lives;
        this.moneyElement.textContent = this.game.money;
        this.waveElement.textContent = this.game.currentWave;
    }

    updateTowerShop(){
        console.log("updateTowerShop")
        this.towerShopContainer.innerHTML = '';
        for (const [key, towerData] of Object.entries(towerTypes)) {
            console.log(towerData)
            console.log(this.towerShopContainer)
            // Créations des tours pour le shop a faire ici car pas vraiment des object de types tours 
            // Et c mieux si c comme ca 
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
            // Evènement sur chauqe tour du shop
            // Ajout des événements pour afficher/masquer le tooltip
            towerElement.addEventListener('mouseenter', () => this.showTowerTooltip(towerElement, towerData));
            towerElement.addEventListener('mouseleave', () => this.hideTowerTooltip());

            // Ajout de l'événement pour sélectionner la tour
            towerElement.addEventListener('click', () => this.selectTower(key, towerData, towerElement));        
            
            this.towerShopContainer.appendChild(towerElement);
        }

        // A voir si je le laisse ou pas
        // Evènements pour les tours du shop
        // Ajout d'un écouteur global qui vérifie les clics en dehors de la tour sélectionnée
        document.addEventListener('click', (event) => {
            // this.selectedTowerElement.contains(event.target) vérifie si l'élément cliqué est la tour sélectionnée
            if (this.selectedTowerElement && this.selectedTowerElement.contains(event.target)) {
                // Le clic est sur la tour sélectionnée, ne rien faire
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
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.bottom = `${window.innerHeight - rect.top + 25}px`;
        
        // Ajouter le tooltip au document
        document.body.appendChild(tooltip);
    }
    
    hideTowerTooltip() {
        // Supprimer tous les tooltips existants
        const tooltips = document.querySelectorAll('.tower-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    selectTower(towerKey, towerData, element) {
        console.log(`Vous avez sélectionné la tour: ${towerData.name}`);
        // Désélectionner toutes les tours avant de sélectionner la nouvelle
        this.unselectTower();
        const towerContainer = element.querySelector('.tower-on-shop');
        if (towerContainer) {
            towerContainer.style.backgroundColor = "grey";
            towerContainer.style.borderRadius = "5px";
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
            el.style.backgroundColor = "";
            el.style.borderRadius = "";
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
