import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import config from '../../src/config.js';
import { createApp } from '../../src/app.js';
import {
  clearMongoMemory,
  connectMongoMemory,
  disconnectMongoMemory,
} from '../helpers/mongoMemory.js';

describe('Product Service Routes Tests', () => {
  beforeAll(async () => {
    await connectMongoMemory();
  });

  afterEach(async () => {
    await clearMongoMemory();
  });

  afterAll(async () => {
    await disconnectMongoMemory();
  });

  // Mock login function
  function createToken() {
    return jwt.sign({ id: 'tester', email: 'tester@example.com' }, config.jwtSecret);
  }

  // Test case for creating a product
  it('POST / creates a product, then GET /:id returns it', async () => {
    const app = createApp();
    const token = createToken();

    const product = {
      id: `p-${Date.now()}`,
      name: 'Phone',
      description: 'Smart phone',
      price: 100,
      category: 'electronics',
    };

    const created = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .expect(201);

    expect(created.body).toMatchObject(product);
    expect(created.body._id).toBeTruthy();

    const fetched = await request(app).get(`/${product.id}`).expect(200);
    expect(fetched.body).toMatchObject(product);
  });

  // Test case for updating a product
  it('PUT /:id updates a product, then GET /:id returns it', async () => {
    const app = createApp();
    const token = createToken();

    const productId = `p-${Date.now()}`;

    await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: productId,
        name: 'Phone',
        description: 'Smart phone',
        price: 100,
        category: 'electronics',
      })
      .expect(201);

    const product = {
      id: productId,
      name: 'Updated Phone',
      description: 'Updated description',
      price: 120,
      category: 'electronics',
    };

    const updated = await request(app)
      .put(`/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .expect(200);
    expect(updated.body).toMatchObject(product);

    const fetched = await request(app).get(`/${productId}`).expect(200);
    expect(fetched.body).toMatchObject(product);
  });

  // Test case for deleting a product
  it('DELETE /:id deletes a product, then GET /:id returns 404', async () => {
    const app = createApp();
    const token = createToken();

    const productId = `p-${Date.now()}`;
    const product = {
      id: productId,
      name: 'ToDelete',
      description: 'Delete me',
      price: 50,
      category: 'electronics',
    };

    await request(app).post('/').set('Authorization', `Bearer ${token}`).send(product).expect(201);

    const deleted = await request(app)
      .delete(`/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(deleted.body).toMatchObject(product);

    await request(app).get(`/${productId}`).expect(404);
  });

  // Test case for creating a product with missing required fields
  it('POST / returns 400 when required fields are missing', async () => {
    const app = createApp();
    const token = createToken();

    await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: `p-${Date.now()}`,
        name: 'MissingPrice',
        description: 'No price',
        category: 'electronics',
      })
      .expect(400);
  });

  // Test case for creating a product without authorization
  it('POST / returns 401 without token', async () => {
    const app = createApp();
    await request(app)
      .post('/')
      .send({
        id: `p-${Date.now()}`,
        name: 'NoAuth',
        description: 'No token',
        price: 10,
        category: 'misc',
      })
      .expect(401);
  });

  // Test case for updating a product without authorization
  it('PUT /:id returns 401 without token', async () => {
    const app = createApp();
    await request(app)
      .put('/p-1')
      .send({
        id: 'p-1',
        name: 'Updated',
        description: 'Updated',
        price: 10,
        category: 'misc',
      })
      .expect(401);
  });

  // Test case for deleting a product without authorization
  it('DELETE /:id returns 401 without token', async () => {
    const app = createApp();
    await request(app).delete('/p-1').expect(401);
  });

  // Test case for creating a product with an invalid token
  it('POST / returns 403 with invalid token', async () => {
    const app = createApp();
    await request(app)
      .post('/')
      .set('Authorization', 'Bearer invalid.token.value')
      .send({
        id: `p-${Date.now()}`,
        name: 'BadToken',
        description: 'Forbidden',
        price: 10,
        category: 'misc',
      })
      .expect(403);
  });

  // Test case for retrieving an unknown product
  it('GET /:id returns 404 when product not found', async () => {
    const app = createApp();
    await request(app).get('/unknown-id').expect(404);
  });
});
