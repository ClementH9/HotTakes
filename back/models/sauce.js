// Importation du module Mongoose pour la gestion de MongoDB
const mongoose = require('mongoose');

// Définition du schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true }, // Nom de la sauce
    manufacturer: { type: String, required: true }, // Fabricant de la sauce
    description: { type: String, required: true }, // Description de la sauce
    mainPepper: { type: String, required: true }, // Principal ingrédient de la sauce
    imageUrl: { type: String, required: true }, // URL de l'image de la sauce
    heat: { type: String, required: true }, // Niveau de piquant de la sauce
    likes: { type: Number, default: 0 }, // Nombre de likes, initialisé à 0 par défaut
    dislikes: { type: Number, default: 0 }, // Nombre de dislikes, initialisé à 0 par défaut
    usersLiked: { type: [String] }, // Tableau des utilisateurs ayant aimé la sauce
    usersDisliked: { type: [String] }, // Tableau des utilisateurs ayant désaimé la sauce
    userId: { type: String, required: true } // ID de l'utilisateur créant la sauce
});

// Exportation du modèle "Sauce" basé sur le schéma défini
module.exports = mongoose.model('Sauce', sauceSchema);