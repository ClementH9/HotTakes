// Importation des modules nécessaires
const mongoose = require('mongoose'); // Module pour la gestion de MongoDB
const uniqueValidator = require('mongoose-unique-validator'); // Plugin Mongoose pour les contraintes d'unicité

// Définition du schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Champ pour l'adresse e-mail, avec contrainte d'unicité
    password: { type: String, required: true } // Champ pour le mot de passe
});

// Ajout du plugin uniqueValidator pour gérer les erreurs d'unicité
userSchema.plugin(uniqueValidator);

// Exportation du modèle User basé sur le schéma défini
module.exports = mongoose.model('user', userSchema);