// Importation du module Multer pour la gestion des fichiers
const multer = require('multer');

// Types MIME associés aux extensions de fichiers d'image
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
    // Définition du répertoire de destination des fichiers téléchargés
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Génération du nom de fichier
    filename: (req, file, callback) => {
        // Remplacement des espaces par des underscores dans le nom du fichier
        const name = file.originalname.split(' ').join('_');
        // Détermination de l'extension en fonction du type MIME du fichier
        const extension = MIME_TYPES[file.mimetype];
        // Construction du nom de fichier final avec un horodatage unique
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exportation d'une instance de Multer configurée pour gérer un seul fichier avec le nom "image"
module.exports = multer({ storage: storage }).single('image');