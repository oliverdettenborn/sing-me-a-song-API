const router = require("express").Router();
const sanitize = require("sanitize-html");

const { genresSchemas } = require("../schemas");
const genresController = require("../controllers/genresController");
const AlredyExistsError = require("../erros/AlredyExistsError");

router.post("/", async (req, res) => {
  if (genresSchemas.create.validate(req.body).error) {
    return res.status(422).send({ message: "Name invalid" });
  }
  const name = sanitize(req.body.name);

  try {
    const newGenre = await genresController.create(name);
    res.status(201).send(newGenre);
  } catch (err) {
    console.error(err);
    if (err instanceof AlredyExistsError)
      res.status(409).send({ message: "This genre alredy exists" });
  }
});

module.exports = router;
