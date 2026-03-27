import { describe, expect, it, vi } from 'vitest';

// Mock the Product model
vi.mock('../../src/models/Product.js', () => {
  function ProductMock() {}
  ProductMock.findOne = vi.fn();
  ProductMock.findOneAndUpdate = vi.fn();
  ProductMock.findOneAndDelete = vi.fn();
  return { default: ProductMock };
});

// Mock the response object
function createRes() {
  const res = {
    status: vi.fn(() => res),
    send: vi.fn(() => res),
  };
  return res;
}

describe('Product Service Controller Tests', () => {
  // Test case for creating a product
  it('createProduct returns 201 and product on success', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { createProduct } = await import('../../src/controllers/products.controller.js');

    const savedProduct = { _id: 'abc', id: 'p-1', name: 'Phone' };
    Product.prototype.save = vi.fn().mockResolvedValue(savedProduct);

    const req = {
      body: {
        id: 'p-1',
        name: 'Phone',
        description: 'Smart phone',
        price: 100,
        category: 'electronics',
      },
    };
    const res = createRes();

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(savedProduct);
  });

  // Test case for creating a product with missing required fields
  it('createProduct returns 400 when required fields are missing', async () => {
    const { createProduct } = await import('../../src/controllers/products.controller.js');

    const req = { body: { id: 'p-1', name: 'Phone' } };
    const res = createRes();

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      'id, name, description, price, and category are required',
    );
  });

  // Test case for creating a product with a validation error
  it('createProduct returns 400 on validation error', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { createProduct } = await import('../../src/controllers/products.controller.js');

    const err = Object.assign(new Error('bad'), { name: 'ValidationError' });
    Product.prototype.save = vi.fn().mockRejectedValue(err);

    const req = {
      body: {
        id: 'p-1',
        name: 'Phone',
        description: 'Smart phone',
        price: 100,
        category: 'electronics',
      },
    };
    const res = createRes();

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(err);
  });

  // Test case for retrieving a product
  it('getProductById returns product', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { getProductById } = await import('../../src/controllers/products.controller.js');

    const product = { id: 'p-1', name: 'Phone' };
    Product.findOne.mockResolvedValue(product);

    const req = { params: { id: 'p-1' } };
    const res = createRes();

    await getProductById(req, res);

    expect(Product.findOne).toHaveBeenCalledWith({ id: 'p-1' });
    expect(res.send).toHaveBeenCalledWith(product);
  });

  // Test case for retrieving an unknown product
  it('getProductById returns 404 when product not found', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { getProductById } = await import('../../src/controllers/products.controller.js');

    Product.findOne.mockResolvedValue(null);

    const req = { params: { id: 'missing' } };
    const res = createRes();

    await getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Product not found');
  });

  // Test case for updating a product
  it('updateProduct returns updated product', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { updateProduct } = await import('../../src/controllers/products.controller.js');

    const updated = { id: 'p-1', name: 'Updated' };
    Product.findOneAndUpdate.mockResolvedValue(updated);

    const req = {
      params: { id: 'p-1' },
      body: {
        id: 'p-1',
        name: 'Updated',
        description: 'Smart phone',
        price: 120,
        category: 'electronics',
      },
    };
    const res = createRes();

    await updateProduct(req, res);

    expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
      { id: 'p-1' },
      {
        id: 'p-1',
        name: 'Updated',
        description: 'Smart phone',
        price: 120,
        category: 'electronics',
      },
      { new: true, runValidators: true },
    );
    expect(res.send).toHaveBeenCalledWith(updated);
  });

  // Test case for updating a product with missing required fields
  it('updateProduct returns 400 when required fields are missing', async () => {
    const { updateProduct } = await import('../../src/controllers/products.controller.js');

    const req = { params: { id: 'p-1' }, body: { name: 'Updated' } };
    const res = createRes();

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      'id, name, description, price, and category are required',
    );
  });

  // Test case for updating an unknown product
  it('updateProduct returns 404 when product not found', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { updateProduct } = await import('../../src/controllers/products.controller.js');

    Product.findOneAndUpdate.mockResolvedValue(null);

    const req = {
      params: { id: 'missing' },
      body: {
        id: 'missing',
        name: 'Updated',
        description: 'desc',
        price: 120,
        category: 'electronics',
      },
    };
    const res = createRes();

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Product not found');
  });

  // Test case for deleting a product
  it('deleteProduct returns deleted product', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { deleteProduct } = await import('../../src/controllers/products.controller.js');

    const deleted = { id: 'p-1', name: 'Phone' };
    Product.findOneAndDelete.mockResolvedValue(deleted);

    const req = { params: { id: 'p-1' } };
    const res = createRes();

    await deleteProduct(req, res);

    expect(Product.findOneAndDelete).toHaveBeenCalledWith({ id: 'p-1' });
    expect(res.send).toHaveBeenCalledWith(deleted);
  });

  // Test case for deleting an unknown product
  it('deleteProduct returns 404 when product not found', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { deleteProduct } = await import('../../src/controllers/products.controller.js');

    Product.findOneAndDelete.mockResolvedValue(null);

    const req = { params: { id: 'missing' } };
    const res = createRes();

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Product not found');
  });

  // Test case for deleting a product with an unexpected error
  it('deleteProduct returns 500 on unexpected error', async () => {
    const { default: Product } = await import('../../src/models/Product.js');
    const { deleteProduct } = await import('../../src/controllers/products.controller.js');

    const err = Object.assign(new Error('boom'), { name: 'SomeError' });
    Product.findOneAndDelete.mockRejectedValue(err);

    const req = { params: { id: 'p-1' } };
    const res = createRes();

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(err);
  });
});
