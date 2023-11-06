// Importation des modules nécessaires
const Sauce = require('../models/sauce'); // Importation du modèle de données de sauce
const fs = require('fs'); // Module pour la gestion des fichiers

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // Analyse du corps de la requête pour obtenir les données de la sauce
    const sauceObject = JSON.parse(req.body.sauce);
    
    // Suppression des champs _id et _userId pour des raisons de sécurité
    delete sauceObject._id;
    delete sauceObject._userId;
    
    // Création d'une instance de Sauce avec les données de la requête
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId, // Assignation de l'ID de l'utilisateur authentifié
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Construction de l'URL de l'image
    });
    
    // Sauvegarde de la sauce dans la base de données
    sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ error }) });
}

// Fonction pour modifier une sauce existante
exports.modifySauce = (req, res, next) => {
    // Vérification de la présence d'un fichier (image) dans la requête
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce), // Si une nouvelle image est fournie, mise à jour de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // Sinon, mise à jour des autres champs
    
    // Suppression du champ _userId pour des raisons de sécurité
    delete sauceObject._userId;
    
    // Recherche de la sauce par son ID
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        // Vérification de l'autorisation de modification (l'utilisateur doit être le propriétaire de la sauce)
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' });
        } else {
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
}

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // Recherche de la sauce par son ID
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        // Vérification de l'autorisation de suppression (l'utilisateur doit être le propriétaire de la sauce)
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' });
        } else {
            // Extraction du nom de fichier de l'URL de l'image
            const filename = sauce.imageUrl.split('/images/')[1];
            
            // Suppression du fichier image du serveur
            fs.unlink(`images/${filename}`, () => {
                // Suppression de la sauce de la base de données
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    });
};

// Fonction pour obtenir les détails d'une sauce particulière
exports.getOneSauce = (req, res, next) => {
    // Recherche de la sauce par son ID
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

// Fonction pour obtenir la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // Recherche de toutes les sauces dans la base de données
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.manageLike = (req, res, next) => {
  // On récupère l'userId
  let userId = req.body.userId;
  // On récupère le sauceId
  let sauceId = req.params.id;
  // On récupère le like de la requête du body
  let like = req.body.like;
  
  if (like === 1) {
    // Si l'utilisateur clique sur le pouce Like pour la première fois
    // => on met à jour la sauce ayant cet Id
    Sauce.updateOne(
      { _id: sauceId },
      {
        // [ mongoDB push operator ]
        // On ajoute (on pousse) l'userId au tableau [array] des usersLiked
        $push: { usersLiked: userId },
        // [ mongoDB increment operator ]
        // On incrémente likes
        $inc: { likes: +1 },
      }
    )
      .then(() => res.status(200).json({ message: "Like ajouté par l'utilisateur !" }))
      .catch((error) => res.status(400).json({ error }));
  }
  
  if (like === -1) {
    // Si l'utilisateur clique sur le pouce disLike pour la première fois
    // => on met à jour la sauce ayant cet Id
    Sauce.updateOne(
      { _id: sauceId },
      {
        // [ mongoDB push operator ]
        // On ajoute (on pousse) l'userId au tableau [array] des usersDisliked
        $push: { usersDisliked: userId },
        // [ mongoDB increment operator ]
        // On incrémente dislikes
        $inc: { dislikes: +1 },
      }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté par l'utilisateur !" }))
      .catch((error) => res.status(400).json({ error }));
  }
  
  // Suppression like ou dislike
  if (like === 0) {
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        // Suppression like
        // Si l'utilisateur a déjà cliqué sur le pouce like donc si l'userId est inclus dans le tableau des usersLiked
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            // [ mongoDB pull operator ]
            // On supprime l'userId du tableau des usersLiked et on décrémente likes
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Like retiré par l'utilisateur !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        // Suppresson dislike
        // Si l'utilisateur a déjà cliqué sur le pouce disLike donc si l'userId est inclus dans le tableau des usersDisliked
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            // [ mongoDB pull operator ]
            // On supprime l'userId du tableau des usersDisliked et on décrémente disLikes
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Dislike retiré par l'utilisateur !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};