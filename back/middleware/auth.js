// Importation du module JSON Web Token (JWT) pour la gestion des jetons d'authentification
const jwt = require('jsonwebtoken');

// Middleware pour vérifier et décoder un jeton d'authentification
module.exports = (req, res, next) => {
    try {
        // Récupération du jeton d'authentification depuis l'en-tête de la requête
        const token = req.headers.authorization.split(' ')[1];
        
        // Décodage du jeton pour obtenir les informations de l'utilisateur
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Remplacer par la clé secrète appropriée
        
        // Extraction de l'ID de l'utilisateur à partir du jeton décodé
        const userId = decodedToken.userId;
        
        // Ajout des informations d'authentification à l'objet de requête (req.auth)
        req.auth = {
            userId: userId
        };
        
        // Passage au middleware suivant
        next();
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse avec un statut 401 (Non autorisé)
        res.status(401).json({ error });
    }
}