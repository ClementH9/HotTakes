const express = require ('express')
const mongoose = require('mongoose');
const bodyParser = require ('body-parser')

const Sauce = require ('./models/sauce')

mongoose.connect('mongodb+srv://jimbob:<atlasAdminClassrooms59>@admin/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.get('/api/sauces', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        name: 'Mon premier objet',
        manufacturer: ,
        description: 'Les infos de mon premier objet',
        mainPepper: ,
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        heat: ,
        likes: ,
        dislikes: ,
        usersLiked: ,
        usersDisliked: ,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeoi',
        name: 'Mon premier objet',
        manufacturer: ,
        description: 'Les infos de mon premier objet',
        mainPepper: ,
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        heat: ,
        likes: ,
        dislikes: ,
        usersLiked: ,
        usersDisliked: ,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(sauces);
  });

  app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });

module.exports = app;