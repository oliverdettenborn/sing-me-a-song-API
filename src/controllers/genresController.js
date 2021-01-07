const Genre = require("../models/Genre");
const { AlredyExistsError } = require("../erros");

async function create(name) {
  const alredyExist = await Genre.findOne({ where: { name } });

  if (alredyExist) throw new AlredyExistsError();

  const genre = await Genre.create({ name });
  return genre;
}

module.exports = {
  create,
};
