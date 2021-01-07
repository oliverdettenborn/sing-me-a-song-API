const Genre = require("../models/Genre");
const { AlredyExistsError } = require("../erros");
const { func } = require("joi");

async function create(name) {
  const alredyExist = await Genre.findOne({ where: { name } });
  if (alredyExist) throw new AlredyExistsError();

  const genre = await Genre.create({ name });
  return genre;
}

function getAll() {
  return Genre.findAll({
    order: [["name", "ASC"]],
  });
}

module.exports = {
  create,
  getAll,
};
