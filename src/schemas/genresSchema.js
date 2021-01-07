const joi = require("joi");

const create = joi.object({
  name: joi.string().required(),
});

module.exports = {
  create,
};
