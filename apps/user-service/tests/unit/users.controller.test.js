import { describe, expect, it, vi } from 'vitest';

// Mock the User model
vi.mock('../../src/models/User.js', () => {
  function UserMock() {}
  UserMock.findById = vi.fn();
  UserMock.findByIdAndUpdate = vi.fn();
  UserMock.findByIdAndDelete = vi.fn();
  return { default: UserMock };
});

// Mock the response object
function createRes() {
  const res = {
    status: vi.fn(() => res),
    send: vi.fn(() => res),
  };
  return res;
}

describe('User Service Controller Tests', () => {
  // Test case for creating a user
  it('createUser returns 201 and user on success', async () => {
    const { default: User } = await import('../../src/models/User.js');
    const { createUser } = await import('../../src/controllers/users.controller.js');

    const savedUser = { _id: 'abc', name: 'A', email: 'a@a.com' };
    User.prototype.save = vi.fn().mockResolvedValue(savedUser);

    const req = { body: { name: 'A', email: 'a@a.com', password: 'x' } };
    const res = createRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
  });

  // Test case for creating a user with a validation error
  it('createUser returns 400 on validation error', async () => {
    const { default: User } = await import('../../src/models/User.js');
    const { createUser } = await import('../../src/controllers/users.controller.js');

    const err = Object.assign(new Error('bad'), { name: 'ValidationError' });
    User.prototype.save = vi.fn().mockRejectedValue(err);

    const req = { body: { name: 'A', email: 'a@a.com', password: 'x' } };
    const res = createRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(err);
  });

  // Test case for retrieving an unknown user
  it('getUserById returns 404 when user not found', async () => {
    const { default: User } = await import('../../src/models/User.js');
    const { getUserById } = await import('../../src/controllers/users.controller.js');
    User.findById.mockResolvedValue(null);

    const req = { user: { id: '507f1f77bcf86cd799439011' } };
    const res = createRes();

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalled();
  });

  // Test case for updating a user
  it('updateUser returns updated user', async () => {
    const { default: User } = await import('../../src/models/User.js');
    const { updateUser } = await import('../../src/controllers/users.controller.js');
    const updated = { _id: 'id', name: 'New' };
    User.findByIdAndUpdate.mockResolvedValue(updated);

    const req = {
      user: { id: 'id' },
      body: { name: 'New', email: 'new@example.com', password: 'pw' },
    };
    const res = createRes();

    await updateUser(req, res);

    expect(res.send).toHaveBeenCalledWith(updated);
  });

  // Test case for deleting an unknown user
  it('deleteUser returns 404 when user not found', async () => {
    const { default: User } = await import('../../src/models/User.js');
    const { deleteUser } = await import('../../src/controllers/users.controller.js');
    User.findByIdAndDelete.mockResolvedValue(null);

    const req = { user: { id: 'id' } };
    const res = createRes();

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalled();
  });
});
