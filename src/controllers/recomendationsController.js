const Recomendation = require("../models/Recomendation");
const Genre = require("../models/Genre");
const GenreRecomendation = require("../models/GenreRecomendation");
const { InvalidGenreError } = require("../errors");

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
    })
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

module.exports = {
  create,
};
