/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../src/app');

const agent = supertest(app);
const db = require('../../src/database');

async function cleanDatabase() {
  await db.query('DELETE FROM "genreRecomendations"');
  await db.query('DELETE FROM recomendations');
  await db.query('DELETE FROM genres');
}

beforeEach(cleanDatabase);
afterEach(cleanDatabase);
afterAll(async () => {
  await db.close();
});

describe('POST /genres', () => {
  it('should return 422 when not send body', async () => {
    const response = await agent.post('/api/genres');
    expect(response.status).toBe(422);
  });

  it('should return 422 when send invalid attributes at body', async () => {
    const body = {
      nome: 'Lo-fi',
    };
    const response = await agent.post('/api/genres').send(body);
    expect(response.status).toBe(422);
  });

  it('should return 201 when send body with valid attributes', async () => {
    const body = {
      name: 'Lo-Fi',
    };
    const response = await agent.post('/api/genres').send(body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('lo-fi');
  });

  it('should return 409 when this genre alredy exists', async () => {
    await agent.post('/api/genres').send({ name: 'Lo-fi' });
    const body = {
      name: 'lo-Fi',
    };
    const response = await agent.post('/api/genres').send(body);
    expect(response.status).toBe(409);
  });
});

describe('GET /genres', () => {
  it('should return 201 when get all genres', async () => {
    await agent.post('/api/genres').send({ name: 'Lo-fi' });
    await agent.post('/api/genres').send({ name: 'Pop' });

    const response = await agent.get('/api/genres');
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toBe('lo-fi');
    expect(response.body[1]).toHaveProperty('id');
    expect(response.body[1].name).toBe('pop');
  });
});

describe('GET /genres/:id', () => {
  it('should return 201 when have sucess to get a genre by id with your recomendations', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    await agent.post('/api/recomendations').send({
      name: 'Barões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });

    const response = await agent.get(`/api/genres/${result.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('forró');
    expect(response.body.recomendations[0]).toMatchObject({
      name: 'Barões da Pisadinha - Basta você me ligar',
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
      score: 0,
    });
    expect(response.body.scoreGenre).toBe(0);
  });
});
