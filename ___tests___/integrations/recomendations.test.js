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

describe('POST /recomendations', () => {
  it('should return 422 when not send body', async () => {
    const response = await agent.post('/api/recomendations');
    expect(response.status).toBe(422);
  });

  it('should return 422 when send invalid attributes at body', async () => {
    const body = {
      nome: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: '1',
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    };
    const response = await agent.post('/api/recomendations').send(body);
    expect(response.status).toBe(422);
  });

  it('should return 422 when send invalid youtubeLink', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    const body = {
      name: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.google.com/',
    };
    const response = await agent.post('/api/recomendations').send(body);
    expect(response.status).toBe(422);
  });

  it('should return 201 when send body with valid attributes', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    const body = {
      name: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    };

    const response = await agent.post('/api/recomendations').send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      score: 0,
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
      genres: [
        {
          id: result.body.id,
          name: 'forró',
        },
      ],
    });
  });
});

describe('POST /recomendations/:id/upvote', () => {
  it('should return 200 when sucess to up score recomendation', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    const result2 = await agent.post('/api/recomendations').send({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });
    const { id } = result2.body;
    let result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(0);

    const response = await agent.post(`/api/recomendations/${id}/upvote`);
    expect(response.status).toBe(200);

    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(1);

    await agent.post(`/api/recomendations/${id}/upvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(2);

    await agent.post(`/api/recomendations/${id}/upvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(3);

    await agent.post(`/api/recomendations/${id}/upvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(4);

    await agent.post(`/api/recomendations/${id}/upvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(5);
  });
});

describe('POST /recomendations/:id/downvote', () => {
  it('should return 200 when sucess to down score recomendation', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    const result2 = await agent.post('/api/recomendations').send({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });
    const { id } = result2.body;
    let result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(0);

    const response = await agent.post(`/api/recomendations/${id}/downvote`);
    expect(response.status).toBe(200);

    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(-1);

    await agent.post(`/api/recomendations/${id}/downvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(-2);

    await agent.post(`/api/recomendations/${id}/downvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(-3);

    await agent.post(`/api/recomendations/${id}/downvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(-4);

    await agent.post(`/api/recomendations/${id}/downvote`);
    result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`,
    );
    expect(result3[0][0].score).toBe(-5);

    const responseBeforeDestroy = await agent.post(`/api/recomendations/${id}/downvote`);
    expect(responseBeforeDestroy.status).toBe(404);
  });
});
