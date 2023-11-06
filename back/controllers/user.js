// Importation des modules nécessaires
const bcrypt = require('bcrypt'); // Module pour le hachage de mots de passe
const jwt = require('jsonwebtoken'); // Module pour la gestion des jetons d'authentification
const User = require('../models/user'); // Modèle de données pour les utilisateurs

// Fonction pour l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    // Hachage du mot de passe fourni par l'utilisateur avec un sel de 10 itérations
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'une nouvelle instance User avec l'e-mail et le mot de passe haché
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Fonction de connexion de l'utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur par son adresse e-mail dans la base de données
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user === null) {
            // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 401 (Non autorisé)
            res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
        } else {
            // Comparaison du mot de passe fourni par l'utilisateur avec le mot de passe haché enregistré
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    // Si la comparaison échoue, renvoyer une erreur 401 (Non autorisé)
                    res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
                } else {
                    // Si la comparaison réussit, générer un jeton d'authentification JWT
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', // Clé secrète pour signer le jeton (remplacer par une clé sécurisée)
                            { expiresIn: '24h' } // Durée de validité du jeton
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({ error });
            });
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    });
};