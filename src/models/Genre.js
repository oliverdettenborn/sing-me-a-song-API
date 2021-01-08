const { Sequelize } = require('sequelize');
const db = require('../database');

class Genre extends Sequelize.Model {
  static calcScore({ recomendations }) {
    return recomendations.reduce((accumulator, item) => accumulator + item.score, 0);
  }
}

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
    modelName: 'genre',
  },
);

module.exports = Genre;
