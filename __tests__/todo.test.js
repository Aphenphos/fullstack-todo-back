const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const agent = request.agent(app);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('can post a new todo', async () => {
    const signIn = await agent.post('/api/v1/users').send(mockUser);
    expect(signIn.body).toEqual({
      email: mockUser.email,
      password: mockUser.password
    });
    const todo = { task: 'make code work' };
    const res = await agent.post('/api/v1/todos').send(todo);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      task: 'make code work',
      user_id: expect.any(String),
      done: false,
    });
  });

  it('returns list of todos', async () => {
    const signIn = await agent.post('/api/v1/users').send(mockUser);
    expect(signIn.body).toEqual({
      email: mockUser.email,
      password: mockUser.password
    });
    const res = await agent.get('/api/v1/todos');
    expect(res.body.length).toBe(0);
  });

  it('should update a todo status', async () => {
    const signIn = await agent.post('/api/v1/users').send(mockUser);
    expect(signIn.body).toEqual({
      email: mockUser.email,
      password: mockUser.password
    });
    const todo = await agent.post('/api/v1/todos')
      .send({ task: 'make this work' });
    const resp = await agent.put(`/api/v1/todos/${todo.body.id}`)
      .send({ done: true });
    console.log(resp.body);
    expect(resp.status).toBe(200);
    expect(resp.body.done).toEqual(true);
  });

  afterAll(() => {
    pool.end();
  });
});
