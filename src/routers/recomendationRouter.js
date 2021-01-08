/* eslint-disable no-console */
const router = require('express').Router();
const sanitize = require('sanitize-html');
const recomendationsController = require('../controllers/recomendationsController');
const { recomendationsSchemas } = require('../schemas');
const { InvalidGenreError, NotFoundError } = require('../errors');

router.post('/', async (req, res) => {
  const { error } = recomendationsSchemas.create.validate(req.body);
  if (error) {
    return res.status(422).send({ message: error.details[0].message });
  }
  const name = sanitize(req.body.name);
  const youtubeLink = sanitize(req.body.youtubeLink);
  const { genresIds } = req.body;

  try {
    const newRecomendation = await recomendationsController.create({
      name,
      youtubeLink,
      genresIds,
    });
    res.status(201).send(newRecomendation);
  } catch (err) {
    console.error(err);
    if (err instanceof InvalidGenreError) {
      res.status(400).send({ message: 'All genresIds are invalid' });
    } else res.sendStatus(500);
  }
});

router.post('/:id/upvote', async (req, res) => {
  try {
    await recomendationsController.upVote(+req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    if (err instanceof NotFoundError) {
      res.status(404).send({ message: 'Recomendation not found' });
    } else res.sendStatus(500);
  }
});

router.post('/:id/downvote', async (req, res) => {
  try {
    await recomendationsController.downVote(+req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    if (err instanceof NotFoundError) {
      res.status(404).send({ message: 'Recomendation not found' });
    } else res.sendStatus(500);
  }
});

router.get('/random', async (req, res) => {
  try {
    const recomendation = await recomendationsController.getRandomRecomendation();
    res.send(recomendation);
  } catch (err) {
    console.error(err);
    if (err instanceof NotFoundError) {
      res.status(404).send({ message: 'No recommendations registered yet' });
    } else res.sendStatus(500);
  }
});

router.get('/genres/:id/random', async (req, res) => {
  try {
    const recomendation = await recomendationsController.getRecomendationByGenre(+req.params.id);
    res.send(recomendation);
  } catch (err) {
    console.error(err);
    if (err instanceof NotFoundError) {
      res.status(404).send({ message: 'No recommendations registered yet' });
    } else res.sendStatus(500);
  }
});

router.get('/top/:amount', async (req, res) => {
  try {
    const recomendation = await recomendationsController.getTopRecomendations(+req.params.amount);
    res.send(recomendation);
  } catch (err) {
    console.error(err);
    if (err instanceof NotFoundError) {
      res.status(404).send({ message: 'No recommendations registered yet' });
    } else res.sendStatus(500);
  }
});

module.exports = router;
