import bcrypt from 'bcryptjs';
import config from '../config.js';
import User from '../models/User.js';

const BCRYPT_SALT = config.bcryptSalt;

function getUserId(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).send('Unauthorized');
    return null;
  }
  return userId;
}

function stripPassword(user) {
  if (!user) {
    return user;
  }

  // Mongoose document
  if (typeof user.toObject === 'function') {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }

  // Plain object (for unit tests)
  const { password, ...rest } = user;
  return rest;
}

function isBadRequestError(error) {
  return (
    error &&
    (error.name === 'CastError' ||
      error.name === 'BSONTypeError' ||
      error.name === 'ValidationError' ||
      error.name === 'MongoServerError')
  );
}

export async function createUser(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!(name && email && password)) {
      return res.status(400).send('name, email, and password are required');
    }

    const userData = {
      name,
      email,
      password: await bcrypt.hash(password, BCRYPT_SALT),
    };

    const user = new User(userData);
    const savedUser = await user.save();
    return res.status(201).send(stripPassword(savedUser));
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}

export async function getUserById(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.send(stripPassword(user));
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}

export async function updateUser(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const { name, email, password } = req.body || {};
    if (!(name && email && password)) {
      return res.status(400).send('name, email, and password are required');
    }

    const update = {
      name,
      email,
      password: await bcrypt.hash(password, BCRYPT_SALT),
    };

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.send(stripPassword(user));
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.send(stripPassword(user));
  } catch (error) {
    return res.status(isBadRequestError(error) ? 400 : 500).send(error);
  }
}
