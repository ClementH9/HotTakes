// Importation du module Express pour créer un routeur Express
const express = require('express');
const router = express.Router();

// Importation du contrôleur utilisateur (userCtrl)
const userCtrl = require('../controllers/user');

// Définition des routes pour l'inscription et la connexion d'un utilisateur
router.post('/signup', userCtrl.signup); // Route pour l'inscription
router.post('/login', userCtrl.login); // Route pour la connexion

// Exportation du routeur
module.exports = router;