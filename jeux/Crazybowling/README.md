**CrazyBowling** est un jeu de bowling déjanté en 3D développé avec **BabylonJS**, jouable directement depuis votre navigateur.  
Prenez le contrôle de la boule, visez, lancez… et faites tomber toutes les quilles dans une ambiance fun et dynamique !  
L'objectif : **enchaîner les manches et battre votre meilleur score**.

---

## Fonctionnalités

- **Physique réaliste** avec Havok et BabylonJS  
- **Contrôle direct de la boule** via le clavier :
  - `Q` pour aller à gauche  
  - `D` pour aller à droite  
  - `Z` pour lancer la boule

- **Deux tirs par manche**, comme au vrai bowling  
- **Score cumulatif** sur 10 manches  
- **Sauvegarde du meilleur score personnalisé** par utilisateur  
- **Authentification intégrée** pour suivre vos performances  
- **Interface utilisateur dynamique** :
  - Affichage du score
  - Affichage de la manche
  - Boutons de rejouer, continuer ou redémarrer

---

## Comment jouer

1. **Connexion** : Connectez-vous à votre compte
2. **Lancer une partie** : Accédez au jeu via la page d’accueil
3. **Déplacement** : Utilisez `Q` et `D` pour ajuster la position de la boule
4. **Tir** : Appuyez sur `Z` pour lancer la boule (2 essais par manche)
5. **Progression** : Avancez jusqu’à la 10e manche et essayez de battre votre record
6. **Redémarrage** : Un bouton apparaît à la fin du jeu pour recommencer

---

## Structure du jeu

- `Crazybowling.html` : Point d’entrée HTML  
- `app.js` : Initialisation du jeu après authentification  
- `auth.js` : Vérification de l’utilisateur et navigation  
- `game.js` : Lancement moteur BabylonJS + logique de manche  
- `scene.js` : Création de la scène, caméra, lumière, piste  
- `ball.js` : Contrôle, mouvement et reset de la boule  
- `pins.js` : Génération et détection des quilles  
- `controls.js` : Mapping des touches clavier  
- `score.js` : Gestion du score, manche, et classement local  
- `ui.js` : Boutons de navigation, affichage des infos

---

## Personnalisation

Vous pouvez modifier facilement les éléments suivants :

- **Quilles** : dans `pins.js` pour changer le placement ou les mesh  
- **Boule** : dans `ball.js` pour ajuster la taille, force ou comportement  
- **Nombre de manches** : dans `game.js` et `score.js` (`maxRounds`)  
- **Physique** : via `scene.js` en ajustant les paramètres Havok  
- **Interface** : dans `ui.js` pour personnaliser les boutons ou textes