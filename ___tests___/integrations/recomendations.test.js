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

describe('GET /recomendations/random', () => {
  it('should return 404 when dont get a random recomendation because it havent post recomendation yet', async () => {
    const response = await agent.get('/api/recomendations/random');
    expect(response.status).toBe(404);
  });

  it('should return 200 when sucess to get a random recomendation', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    await agent.post('/api/recomendations').send({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });

    const response = await agent.get('/api/recomendations/random');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
      score: 0,
      genres: [
        {
          id: result.body.id,
          name: 'forró',
        },
      ],
    });
  });
});

describe('GET /recomendations/genres/:id/random', () => {
  it('should return 404 when dont get a random recomendation because it havent post recomendation yet', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    const response = await agent.get(`/api/recomendations/genres/${result.body.id}/random`);
    expect(response.status).toBe(404);
  });

  it('should return 200 when sucess to get a random recomendation', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    await agent.post('/api/genres').send({ name: 'Lo-fi' });
    await agent.post('/api/recomendations').send({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });

    const response = await agent.get(`/api/recomendations/genres/${result.body.id}/random`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      name: 'Barrões da Pisadinha - Basta você me ligar',
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
      score: 0,
      genres: [
        {
          id: result.body.id,
          name: 'forró',
        },
      ],
    });
  });
});

describe('GET /recomendations/top/:amout', () => {
  it('should return 404 when dont get a random recomendation because it havent post recomendation yet', async () => {
    const response = await agent.get('/api/recomendations/top/3');
    expect(response.status).toBe(404);
  });

  it('should return 200 when sucess to get a random recomendation', async () => {
    const result = await agent.post('/api/genres').send({ name: 'Forró' });
    await agent.post('/api/genres').send({ name: 'Lo-fi' });
    const rec1 = await agent.post('/api/recomendations').send({
      name: 'Teste 1 - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });
    const rec2 = await agent.post('/api/recomendations').send({
      name: 'Teste 2 - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });
    const rec3 = await agent.post('/api/recomendations').send({
      name: 'Teste 3 - Basta você me ligar',
      genresIds: [result.body.id],
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
    });
    await agent.post(`/api/recomendations/${rec1.body.id}/upvote`);
    await agent.post(`/api/recomendations/${rec2.body.id}/upvote`);
    await agent.post(`/api/recomendations/${rec2.body.id}/upvote`);
    await agent.post(`/api/recomendations/${rec3.body.id}/upvote`);
    await agent.post(`/api/recomendations/${rec3.body.id}/upvote`);
    await agent.post(`/api/recomendations/${rec3.body.id}/upvote`);

    const response = await agent.get('/api/recomendations/top/2');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toMatchObject({
      name: 'Teste 3 - Basta você me ligar',
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
      score: 3,
      genres: [
        {
          id: result.body.id,
          name: 'forró',
        },
      ],
    });
    expect(response.body[1]).toHaveProperty('id');
    expect(response.body[1]).toMatchObject({
      name: 'Teste 2 - Basta você me ligar',
      youtubeLink: 'https://www.youtube.com/watch?v=k4xGU8xoA6w',
      score: 2,
      genres: [
        {
          id: result.body.id,
          name: 'forró',
        },
      ],
    });
  });
});
