const { Op } = require('sequelize');
const Recomendation = require('../models/Recomendation');
const Genre = require('../models/Genre');
const GenreRecomendation = require('../models/GenreRecomendation');
const { InvalidGenreError, NotFoundError } = require('../errors');
const { sortCategoryOfRecomendation, sortItemOfList } = require('../utils/random');

async function create({ name, genresIds, youtubeLink }) {
  const validGenres = await Genre.findAll({ where: { id: genresIds } });
  if (validGenres.length === 0) throw new InvalidGenreError();

  const { id: recomendationId } = await Recomendation.create({
    name,
    youtubeLink,
  });
  await Promise.all(
    validGenres.map(async (g) => {
      await GenreRecomendation.create({ genreId: g.id, recomendationId });
    }),
  );
  return Recomendation.findByPk(recomendationId, {
    include: {
      model: Genre,
      through: {
        attributes: [],
      },
    },
  });
}

async function upVote(id) {
  const recomendation = await Recomendation.findByPk(id);
  if (!recomendation) throw new NotFoundError();

  await recomendation.increment('score');
}

async function downVote(id) {
  const recomendation = await Recomendation.findByPk(id);
  if (!recomendation) throw new NotFoundError();

  await recomendation.decrement('score');

  if (recomendation.score < -5) {
    await GenreRecomendation.destroy({
      where: { recomendationId: recomendation.id },
    });
    await recomendation.destroy();
    throw new NotFoundError();
  }
}

async function getRandomRecomendation() {
  const category = sortCategoryOfRecomendation();
  const operator = category === 'best' ? Op.gte : Op.lt;

  let listRecomendations = await Recomendation.findAll(
    {
      where: { score: { [operator]: 10 } },
      include: {
        model: Genre,
        through: {
          attributes: [],
        },
      },
    },
  );

  if (listRecomendations.length === 0) {
    listRecomendations = await Recomendation.findAll({
      include: {
        model: Genre,
        through: {
          attributes: [],
        },
      },
    });

    if (listRecomendations.length === 0) {
      throw new NotFoundError();
    }
  }

  return sortItemOfList(listRecomendations);
}

module.exports = {
  create,
  upVote,
  downVote,
  getRandomRecomendation,
};
