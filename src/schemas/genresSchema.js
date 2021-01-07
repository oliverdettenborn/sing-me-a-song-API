const joi = require("joi");

const create = joi.object({
  name: joi.string().trim().lowercase({ forced: true }).required(),
});

module.exports = {
  create,
};
