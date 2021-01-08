const joi = require("joi");

const create = joi.object({
  name: joi.string().trim().lowercase().required(),
  genresIds: joi.array().items(joi.number().integer()).required(),
  youtubeLink: joi
    .string()
    .uri()
    .pattern(/^https:\/\/www.youtube.com\//),
});

module.exports = {
  create,
};
