const { Sequelize } = require("sequelize");
const db = require("../database");

class GenreRecomendation extends Sequelize.Model {}

GenreRecomendation.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    genreId: Sequelize.INTEGER,
    recomendationId: Sequelize.INTEGER,
  },
  {
    sequelize: db,
    timestamps: false,
    modelName: "genreRecomendation",
  }
);

module.exports = GenreRecomendation;
