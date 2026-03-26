import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import {
  clearMongoMemory,
  connectMongoMemory,
  disconnectMongoMemory,
} from '../helpers/mongoMemory.js';

describe('User Service API Tests', () => {
  beforeAll(async () => {
    await connectMongoMemory();
  });

  afterEach(async () => {
    await clearMongoMemory();
  });

  afterAll(async () => {
    await disconnectMongoMemory();
  });

  // Test case for creating a user
  it('POST / creates a user, then GET /:id returns it', async () => {
    const app = createApp();

    const email = `u${Date.now()}@example.com`;

    const created = await request(app)
      .post('/')
      .send({ name: 'Test', email, password: 'secret' })
      .expect(201);

    expect(created.body).toMatchObject({ name: 'Test', email });
    expect(created.body._id).toBeTruthy();

    const fetched = await request(app).get(`/${created.body._id}`).expect(200);
    expect(fetched.body).toMatchObject({ _id: created.body._id, name: 'Test', email });
  });

  // Test case for updating a user
  it('PUT /:id updates a user, then GET /:id returns it', async () => {
    const app = createApp();

    const email = `u${Date.now()}@example.com`;

    const created = await request(app)
      .post('/')
      .send({ name: 'Original', email, password: 'secret' })
      .expect(201);

    const updated = await request(app)
      .put(`/${created.body._id}`)
      .send({ name: 'Updated', email, password: 'secret' })
      .expect(200);

    expect(updated.body).toMatchObject({ _id: created.body._id, name: 'Updated', email });

    const fetched = await request(app).get(`/${created.body._id}`).expect(200);
    expect(fetched.body).toMatchObject({ _id: created.body._id, name: 'Updated', email });
  });

  // Test case for deleting a user
  it('DELETE /:id deletes a user, then GET /:id returns 404', async () => {
    const app = createApp();

    const email = `u${Date.now()}@example.com`;

    const created = await request(app)
      .post('/')
      .send({ name: 'ToDelete', email, password: 'secret' })
      .expect(201);

    const deleted = await request(app).delete(`/${created.body._id}`).expect(200);
    expect(deleted.body).toMatchObject({ _id: created.body._id, name: 'ToDelete', email });

    await request(app).get(`/${created.body._id}`).expect(404);
  });

  // Test case for retrieving a user by invalid object id
  it('GET /:id returns 400 for invalid object id', async () => {
    const app = createApp();
    await request(app).get('/not-an-objectid').expect(400);
  });

  // Test case for updating a user by invalid object id
  it('PUT /:id returns 400 for invalid object id', async () => {
    const app = createApp();
    await request(app)
      .put('/not-an-objectid')
      .send({ name: 'Updated', email: 'u@example.com', password: 'secret' })
      .expect(400);
  });

  // Test case for deleting a user by invalid object id
  it('DELETE /:id returns 400 for invalid object id', async () => {
    const app = createApp();
    await request(app).delete('/not-an-objectid').expect(400);
  });
});
