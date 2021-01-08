const Recomendation = require('../models/Recomendation');
const Genre = require('../models/Genre');
const GenreRecomendation = require('../models/GenreRecomendation');
const { InvalidGenreError, NotFoundError } = require('../errors');

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

module.exports = {
  create,
  upVote,
  downVote,
};
