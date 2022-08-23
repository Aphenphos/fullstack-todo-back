const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  const agent = request.agent(app);

  it('creates a new user and signs them in with a cookie', async () => {
    const res = await agent.post('/api/v1/users').send(mockUser);

    expect(res.body).toEqual({
      email: mockUser.email,
      password: mockUser.password
    });

    const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
    expect(session).toBeTruthy();
  });

  it('returns the current user', async () => {
    const me = await agent.get('/api/v1/users/me');
    console.log(me.body);
    expect(me.body).toEqual({
      email: expect.any(String),
      id: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
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
