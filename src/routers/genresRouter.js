/* eslint-disable no-console */
const router = require('express').Router();
const sanitize = require('sanitize-html');

const { genresSchemas } = require('../schemas');
const genresController = require('../controllers/genresController');
const { AlredyExistsError } = require('../errors');

router.post('/', async (req, res) => {
  if (genresSchemas.create.validate(req.body).error) {
    return res.status(422).send({ message: 'Name invalid' });
  }
  const name = String(sanitize(req.body.name)).toLowerCase();

  try {
    const newGenre = await genresController.create(name);
    res.status(201).send(newGenre);
  } catch (err) {
    console.error(err);
    if (err instanceof AlredyExistsError) res.status(409).send({ message: 'This genre alredy exists' });
  }
});

router.get('/', async (req, res) => {
  try {
    const genres = await genresController.getAll();
    res.send(genres);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const genresList = await genresController.getById(+req.params.id);
    res.send(genresList);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
