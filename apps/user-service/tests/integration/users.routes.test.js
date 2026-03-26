import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import {
  clearMongoMemory,
  connectMongoMemory,
  disconnectMongoMemory,
} from '../helpers/mongoMemory.js';

describe('User Service Routes Tests', () => {
  beforeAll(async () => {
    await connectMongoMemory();
  });

  afterEach(async () => {
    await clearMongoMemory();
  });

  afterAll(async () => {
    await disconnectMongoMemory();
  });

  async function login(app, { email, password }) {
    const loggedIn = await request(app).post('/login').send({ email, password }).expect(200);
    expect(loggedIn.body).toHaveProperty('token');
    return loggedIn.body.token;
  }

  // Test case for creating a user
  it('POST / creates a user, then GET /me returns it', async () => {
    const app = createApp();

    const name = 'Test';
    const email = `u${Date.now()}@example.com`;
    const password = 'secret';

    const created = await request(app).post('/').send({ name, email, password }).expect(201);

    expect(created.body).toMatchObject({ name, email });
    expect(created.body._id).toBeTruthy();

    const token = await login(app, { email, password });

    const fetched = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(fetched.body).toMatchObject({ _id: created.body._id, name, email });
  });

  // Test case for updating a user
  it('PUT /me updates a user, then GET /me returns it', async () => {
    const app = createApp();

    const email = `u${Date.now()}@example.com`;
    const password = 'secret';

    const created = await request(app)
      .post('/')
      .send({ name: 'Original', email, password })
      .expect(201);

    const token = await login(app, { email, password });

    const updated = await request(app)
      .put('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated', email, password })
      .expect(200);
    expect(updated.body).toMatchObject({ _id: created.body._id, name: 'Updated', email });

    const fetched = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(fetched.body).toMatchObject({ _id: created.body._id, name: 'Updated', email });
  });

  // Test case for deleting a user
  it('DELETE /me deletes a user, then GET /me returns 404', async () => {
    const app = createApp();

    const email = `u${Date.now()}@example.com`;
    const password = 'secret';

    const created = await request(app)
      .post('/')
      .send({ name: 'ToDelete', email, password })
      .expect(201);

    const token = await login(app, { email, password });

    const deleted = await request(app)
      .delete('/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(deleted.body).toMatchObject({ _id: created.body._id, name: 'ToDelete', email });

    await request(app).get('/me').set('Authorization', `Bearer ${token}`).expect(404);
  });

  // Test case for updating a user without password
  it('PUT /me returns 400 when password is missing', async () => {
    const app = createApp();

    const email = `u${Date.now()}@example.com`;
    const password = 'secret';

    await request(app).post('/').send({ name: 'Test', email, password }).expect(201);

    const token = await login(app, { email, password });

    await request(app)
      .put('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated', email })
      .expect(400);
  });

  // Test case for retrieving a user without authorization
  it('GET /me returns 401 without token', async () => {
    const app = createApp();
    await request(app).get('/me').expect(401);
  });

  // Test case for deleting a user without authorization
  it('DELETE /me returns 401 without token', async () => {
    const app = createApp();
    await request(app).delete('/me').expect(401);
  });
});
