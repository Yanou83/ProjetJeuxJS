# Tower Defense Game

## Description
**Tower Defense** est un jeu de stratégie où vous devez défendre votre base contre des vagues d'ennemis en plaçant des tours défensives de manière stratégique sur la carte.  
Les tours attaquent automatiquement les ennemis à portée.  
L'objectif : **survivre à toutes les vagues** sans que les ennemis atteignent la fin du parcours.

---

## Fonctionnalités

- **Différents types de tours** :
  - Tour Orbital  
  - Fortification Cubique  
  - Pyramide Défensive  
  → Chacune a ses **propres caractéristiques** : dégâts, portée, cadence.

- **Variété d'ennemis** :
  - Basique (ronds)  
  - Rapide (triangles)  
  - Blindé (carrés)

- **Système économique** :
  - Gagnez de l’or en tuant des ennemis
  - Achetez ou vendez vos tours

- **10 vagues progressives** :
  - Difficulté croissante

- **Système de chronomètre** :
  - Mesurez vos performances en temps réel

---

## Comment jouer

1. **Démarrer le jeu** : Cliquez sur **"Start Game"**
2. **Placer des tours** :  
   Sélectionnez une tour dans la boutique → Cliquez sur un emplacement valide de la carte
3. **Lancer des vagues** : Cliquez sur **"Lancer la vague"** pour faire apparaître les ennemis
4. **Gérer vos ressources** :  
   Utilisez l’or gagné pour acheter vos tours
5. **Vendre des tours** : Cliquez sur une tour → Cliquez sur **"Sell"** pour récupérer une partie de l’or
6. **Survivre** : Ne laissez **aucun ennemi atteindre la fin du parcours**

---

## Structure du jeux

- `index.html` : Point d'entrée du jeu  
- `styles.css` : Styles CSS du jeu  
- `game.js` : Classe principale du jeu  
- `map.js` : Gestion de la carte et du chemin  
- `tower.js` & `towerTypes.js` : Gestion des tours et leurs caractéristiques  
- `enemy.js` & `enemyTypes.js` : Gestion des ennemis et leurs caractéristiques  
- `waves.js` & `wavesInformation.js` : Configuration des vagues d'ennemis  
- `bullet.js` : Gestion des projectiles  
- `audio.js` : Système audio (musique et effets sonores)  
- `ath.js` : Interface utilisateur (ATH)  
- `menu.js` : Menus du jeu  
- `chronometre.js` : Système de chronométrage  

---

## Personnalisation

Vous pouvez facilement personnaliser le jeu en modifiant :

- `towerTypes.js` pour ajouter ou modifier des tours  
- `enemyTypes.js` pour créer de nouveaux types d'ennemis  
- `wavesInformation.js` pour configurer les vagues  
- `map.js` pour changer le parcours des ennemis  

-- 

## Ressources

https://pixabay.com/fr/sound-effects/

https://mixkit.co/free-sound-effects/

https://suno.com/home

https://openai.com/sora/