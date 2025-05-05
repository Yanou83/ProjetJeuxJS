# 🎮 Projet de Jeux Web en JavaScript

> Projet réalisé dans le cadre du module **Application Web** (L3 MIASHS - Université Côte d’Azur)  
> Par Yann MONTENOT, Adame LOTFI, Téo VIGLIETTI  
> Année 2024/2025

## 🚀 Présentation générale

Ce projet a pour but de concevoir **trois jeux web originaux** en JavaScript, chacun reposant sur une technologie différente :

- **Canvas** : jeu d'adresse 2D
- **DOM** : tower defense
- **Babylon.js** : jeu 3D en temps réel

Le tout est regroupé sur un **site vitrine responsive** qui permet de lancer chaque jeu et de consulter les scores enregistrés en local.

🕹️ **Jouer en ligne** : [projetjeuxjs.onrender.com](https://projetjeuxjs.onrender.com)

📁 **Code source GitHub** : [github.com/Yanou83/ProjetJeuxJS](https://github.com/Yanou83/ProjetJeuxJS)

---

## 🧩 Répartition des tâches

| Membre         | Jeu réalisé                      | Technologies principales       |
|----------------|----------------------------------|--------------------------------|
| **Yann MONTENOT** | Ratscooter (Canvas)              | JavaScript         |
| **Téo VIGLIETTI** | Tower Defense (DOM)              | JavaScript + DOM        |
| **Adame LOTFI**   | CrazyBowling (Babylon.js)        | JavaScript + Babylon.js + Havok |

---

## 🎯 Jeux développés

### 🐀 Ratscooter (Canvas)

- Le joueur incarne un rat sur un scooter dans les échafaudages de Paris.
- Mécaniques :
  - Génération dynamique de plateformes
  - Boost avec animation gif
  - Bonus aléatoires (croissants, baguettes)
  - Gestion de la chute et de l’inclinaison
- Sauvegarde du meilleur score
- Rat dessiné manuellement via Canvas 2D

### 🛡️ Tower Defense (DOM)

- Défendez votre base en plaçant stratégiquement des tours.
- Fonctionnalités :
  - 3 types de tours et 3 types d’ennemis
  - Vagues progressives (10 au total)
  - Chronomètre pour battre son record
  - Style visuel "dessin au crayon"
- Sauvegarde du meilleur temps

### 🎳 CrazyBowling (Babylon.js)

- Version revisitée du bowling en 3D avec physique réaliste.
- Contrôle de la boule via le clavier
- Calcul du score selon les règles classiques
- Sauvegarde du score et authentification utilisateur
- Utilisation de Babylon.js et Havok Physics

---

## 🌐 Site vitrine : GamesHub

- Interface commune pour accéder aux trois jeux
- Scores affichés dynamiquement depuis `localStorage`
- Responsive design (PC & mobile)

---

## 🧠 Technologies utilisées

- HTML5 / CSS3
- JavaScript (Canvas, DOM, Babylon.js)
- Babylon.js + Havok Physics
- localStorage / JSON
- Git + GitHub

---

## ✅ Bilan du projet

- ✅ Trois jeux originaux et fonctionnels
- ✅ Site vitrine fluide et responsive
- ✅ Collaboration efficace et apprentissage technique
- ✅ Déploiement en ligne réussi

### 🔧 Améliorations possibles

- Modulariser les composants partagés (CSS, menus)
- Ajouter un backend pour scores en ligne
- Améliorer l’accessibilité mobile et la gestion des touches

---

## 📂 Lancer en local

```bash
git clone https://github.com/Yanou83/ProjetJeuxJS.git
cd ProjetJeuxJS
# Ouvrir index.html dans un navigateur
