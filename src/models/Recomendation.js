const { Sequelize } = require('sequelize');
const db = require('../database');

class Recomendation extends Sequelize.Model {}

Recomendation.init(
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
    youtubeLink: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    timestamps: false,
    modelName: 'recomendation',
  },
);

module.exports = Recomendation;
