const express = require('express');
const path = require('path');

const app = express();
const PORT = 5173; 

// Servir les fichiers statiques du dossier "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

// Servir les fichiers statiques du dossier "pages"
app.use(express.static(path.join(__dirname, 'pages')));

// Servir le dossier public (Ratscooter, Crazybowling, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Servir les fichiers statiques des jeux
app.use('/jeux', express.static(path.join(__dirname, 'jeux')));

// Route principale (accueil)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/connexion.html'));
});


app.get('/Ratscooter', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/jeux/Ratscooter/Ratscooter.html'));
});

app.get('/Crazybowling', (req, res) => {
    res.sendFile(path.join(__dirname, 'jeux/Crazybowling/Crazybowling.html'));
});

// Gestion des erreurs 404 (toutes les autres routes)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages/404.html'));
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

module.exports = app;