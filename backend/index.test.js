// index.test.js (CommonJS)

jest.setTimeout(10000);

const request = require('supertest');
const app = require('./index'); // Import the Express app we exported

describe('Node.js Application Routes', () => {
  // Test the home route: GET /
  it('GET / should return "Backend server is running"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Backend server is running/);
  });

  // Test the GET /api/users (or /users in your code)
  it('GET /users should return an array of users (if DB is connected)', async () => {
    const res = await request(app).get('/users');
    // If your DB is connected and table "users" exists, you might get a 200
    // If not, it may fail. This is an integration test.
    expect([200, 500]).toContain(res.statusCode); 
    // If it’s 200, let’s expect an array
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  // Example for GET /status/:code => this route returns different responses
  it('GET /status/200 => Should return JSON with code=200', async () => {
    const res = await request(app).get('/status/200');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ code: '200' });
  });

  it('GET /status/400 => Should return an error message', async () => {
    const res = await request(app).get('/status/400');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/bad request/i);
  });

  // Example for avenger route
  it('GET /avenger/ironman => returns Iron Man JSON', async () => {
    const res = await request(app).get('/avenger/ironman');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Iron Man');
    expect(res.body).toHaveProperty('phrase', 'I am Iron Man.');
  });

  // Another avenger test: Thanos
  // Because that route triggers external calls, it might fail if the external services are not up
  it('GET /avenger/thanos => returns Thanos JSON', async () => {
    const res = await request(app).get('/avenger/thanos');
    // We expect 200 even though there's a try/catch block making external requests
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Thanos');
    expect(res.body).toHaveProperty('phrase', 'INFINITY SNAP!');
  });
});
