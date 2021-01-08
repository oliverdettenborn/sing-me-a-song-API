"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("genreRecomendations", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "genres", key: "id" },
      },
      recomendationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "recomendations", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("genreRecomendations");
  },
};
