const joi = require("joi");

const create = joi.object({
  name: joi.string().trim().lowercase().required(),
});

module.exports = {
  create,
};
