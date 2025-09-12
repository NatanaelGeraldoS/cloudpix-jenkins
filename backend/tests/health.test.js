const request = require("supertest");
const app = require("../src/app");

describe("Health & Metrics", () => {
    it("GET /healthz -> 200", async () => {
        const res = await request(app).get("/healthz");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("status", "ok");
    });

    it("GET /metrics -> 200 text/plain", async () => {
        const res = await request(app).get("/metrics");
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/text\/plain/);
    });
});
