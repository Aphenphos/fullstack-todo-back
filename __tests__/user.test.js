const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('delete user session(logout)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(mockUser);
    const resp = await agent
      .delete('/api/v1/users/sessions');
    console.log(resp.body);
    expect(resp.status).toBe(204);
  });

  afterAll(() => {
    pool.end();
  });
});
