const app = require("../../src/app");
const supertest = require("supertest");
const agent = supertest(app);
const db = require("../../src/database");

async function cleanDatabase() {
  await db.query("DELETE FROM genres");
}

beforeEach(cleanDatabase);
afterEach(cleanDatabase);
afterAll(async () => {
  await db.close();
});

describe("POST /genres", () => {
  it("should return 422 when not send body", async () => {
    const response = await agent.post("/api/genres");
    expect(response.status).toBe(422);
  });

  it("should return 422 when send invalid attributes at body", async () => {
    const body = {
      nome: "Lo-fi",
    };
    const response = await agent.post("/api/genres").send(body);
    expect(response.status).toBe(422);
  });

  it("should return 201 when send body with valid attributes", async () => {
    const body = {
      name: "Lo-Fi",
    };
    const response = await agent.post("/api/genres").send(body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("lo-fi");
  });

  it("should return 409 when this genre alredy exists", async () => {
    await agent.post("/api/genres").send({ name: "Lo-fi" });
    const body = {
      name: "lo-Fi",
    };
    const response = await agent.post("/api/genres").send(body);
    expect(response.status).toBe(409);
  });
});

describe("GET /genres", () => {
  it("should return 201 when send body with valid attributes", async () => {
    await agent.post("/api/genres").send({ name: "Lo-fi" });
    await agent.post("/api/genres").send({ name: "Pop" });

    const response = await agent.get("/api/genres");
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toBe("lo-fi");
    expect(response.body[1]).toHaveProperty("id");
    expect(response.body[1].name).toBe("pop");
  });
});
