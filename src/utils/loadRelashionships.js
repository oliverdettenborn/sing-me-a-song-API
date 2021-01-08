const Genre = require('../models/Genre');
const Recomendation = require('../models/Recomendation');
const GenreRecomendation = require('../models/GenreRecomendation');

Recomendation.belongsToMany(Genre, { through: GenreRecomendation });
Genre.belongsToMany(Recomendation, { through: GenreRecomendation });
