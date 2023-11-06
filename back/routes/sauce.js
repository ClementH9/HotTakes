// Importation des modules nécessaires
const express = require('express'); // Express pour créer un routeur Express
const router = express.Router(); // Créez un routeur Express
const auth = require('../middleware/auth'); // Middleware d'authentification
const multer = require('../middleware/multer-config'); // Middleware pour la gestion des fichiers

const sauceCtrl = require('../controllers/sauce'); // Contrôleur pour les actions relatives aux sauces

// Définition des routes et de leurs middlewares associés

// Route pour créer une nouvelle sauce (POST /api/sauces/)
router.post('/', auth, multer, sauceCtrl.createSauce);

// Route pour modifier une sauce existante (PUT /api/sauces/:id)
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Route pour supprimer une sauce (DELETE /api/sauces/:id)
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Route pour obtenir les détails d'une sauce particulière (GET /api/sauces/:id)
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Route pour obtenir la liste de toutes les sauces (GET /api/sauces/)
router.get('/', auth, sauceCtrl.getAllSauces);

// Route pour gérer les likes/dislikes d'une sauce (POST /api/sauces/:id/like)
router.post("/:id/like", auth, sauceCtrl.manageLike);

// Exportation du routeur pour une utilisation ultérieure
module.exports = router;