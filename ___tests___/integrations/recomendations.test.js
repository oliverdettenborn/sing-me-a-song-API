const app = require("../../src/app");
const supertest = require("supertest");
const agent = supertest(app);
const db = require("../../src/database");

async function cleanDatabase() {
  await db.query(`DELETE FROM "genreRecomendations"`);
  await db.query("DELETE FROM recomendations");
  await db.query("DELETE FROM genres");
}

beforeEach(cleanDatabase);
afterEach(cleanDatabase);
afterAll(async () => {
  await db.close();
});

describe("POST /recomendations", () => {
  it("should return 422 when not send body", async () => {
    const response = await agent.post("/api/recomendations");
    expect(response.status).toBe(422);
  });

  it("should return 422 when send invalid attributes at body", async () => {
    const body = {
      nome: "Barrões da Pisadinha - Basta você me ligar",
      genresIds: "1",
      youtubeLink: "https://www.youtube.com/watch?v=k4xGU8xoA6w",
    };
    const response = await agent.post("/api/recomendations").send(body);
    expect(response.status).toBe(422);
  });

  it("should return 422 when send invalid youtubeLink", async () => {
    const result = await agent.post("/api/genres").send({ name: "Forró" });
    const body = {
      name: "Barrões da Pisadinha - Basta você me ligar",
      genresIds: [result.body.id],
      youtubeLink: "https://www.google.com/",
    };
    const response = await agent.post("/api/recomendations").send(body);
    expect(response.status).toBe(422);
  });

  it("should return 201 when send body with valid attributes", async () => {
    const result = await agent.post("/api/genres").send({ name: "Forró" });
    const body = {
      name: "Barrões da Pisadinha - Basta você me ligar",
      genresIds: [result.body.id],
      youtubeLink: "https://www.youtube.com/watch?v=k4xGU8xoA6w",
    };

    const response = await agent.post("/api/recomendations").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject({
      name: "Barrões da Pisadinha - Basta você me ligar",
      score: 0,
      youtubeLink: "https://www.youtube.com/watch?v=k4xGU8xoA6w",
      genres: [
        {
          id: result.body.id,
          name: "forró",
        },
      ],
    });
  });
});

describe("POST /recomendations/:id/upvote", () => {
  it("should return 201 when sucess to up score recomendation", async () => {
    const result = await agent.post("/api/genres").send({ name: "Forró" });
    const result2 = await agent.post("/api/recomendations").send({
      name: "Barrões da Pisadinha - Basta você me ligar",
      genresIds: [result.body.id],
      youtubeLink: "https://www.youtube.com/watch?v=k4xGU8xoA6w",
    });
    const id = result2.body.id;

    const response = await agent.post(`/api/recomendations/${id}/upvote`);
    expect(response.status).toBe(200);

    await agent.post(`/api/recomendations/${id}/upvote`);
    await agent.post(`/api/recomendations/${id}/upvote`);
    await agent.post(`/api/recomendations/${id}/upvote`);
    await agent.post(`/api/recomendations/${id}/upvote`);
    const result3 = await db.query(
      `SELECT * FROM recomendations WHERE id=${id}`
    );
    const recomendation = result3[0][0];
    expect(recomendation.score).toBe(5);
  });
});
