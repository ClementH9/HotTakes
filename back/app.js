// Importation des modules nécessaires
const express = require('express'); // Express pour créer l'application web
const bodyParser = require('body-parser'); // Middleware pour analyser les corps de requête
const mongoose = require('mongoose'); // Mongoose pour la gestion de MongoDB
const path = require('path'); // Path pour la gestion des fichiers et répertoires
const mongooseExpressErrorHandler = require("mongoose-express-error-handler"); // Middleware pour la gestion des erreurs de Mongoose

// Importation des routes personnalisées
const sauceRoutes = require('./routes/sauce'); // Routes pour les sauces
const userRoutes = require('./routes/user'); // Routes pour les utilisateurs

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://ClementH9:OpenClassrooms59@cluster0.k8lz0bp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, // Utiliser un analyseur de nouvelle version de l'URL
  useUnifiedTopology: true // Utiliser un moteur de serveur de nouvelle génération
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Initialisation de l'application Express
const app = express();

// Utilisation de middleware pour gérer les requêtes JSON
app.use(express.json());

// Utilisation du middleware mongooseExpressErrorHandler pour gérer les erreurs MongoDB
app.use(mongooseExpressErrorHandler);

// Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autoriser certains en-têtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autoriser certaines méthodes HTTP
    next();
  });
  
// Utilisation du middleware bodyParser pour analyser les corps de requête en JSON
app.use(bodyParser.json());

// Utilisation des routes personnalisées pour les sauces et les utilisateurs
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Middleware pour servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express pour une utilisation ultérieure
module.exports = app;