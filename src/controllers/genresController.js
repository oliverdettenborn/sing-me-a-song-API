const Genre = require('../models/Genre');
const Recomendation = require('../models/Recomendation');
const { AlredyExistsError } = require('../errors');

async function create(name) {
  const alredyExist = await Genre.findOne({ where: { name } });
  if (alredyExist) throw new AlredyExistsError();

  const genre = await Genre.create({ name });
  return genre;
}

function getAll() {
  return Genre.findAll({
    order: [['name', 'ASC']],
  });
}

async function getById(id) {
  const genre = await Genre.findOne({
    where: { id },
    include: {
      model: Recomendation,
      through: {
        attributes: [],
      },
    },
  });
  genre.dataValues.scoreGenre = Genre.calcScore(genre.dataValues);
  return genre;
}

module.exports = {
  create,
  getAll,
  getById,
};
