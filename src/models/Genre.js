const { Sequelize } = require("sequelize");
const db = require("../database");

class Genre extends Sequelize.Model {}

Genre.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    timestamps: false,
    modelName: "genre",
  }
);

module.exports = Genre;
