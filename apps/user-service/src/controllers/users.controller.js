import User from '../models/User.js';

function isMongoCastError(error) {
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
    const user = new User(req.body);
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(isMongoCastError(error) ? 400 : 500).send(error);
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (error) {
    return res.status(isMongoCastError(error) ? 400 : 500).send(error);
  }
}

export async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (error) {
    return res.status(isMongoCastError(error) ? 400 : 500).send(error);
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (error) {
    return res.status(isMongoCastError(error) ? 400 : 500).send(error);
  }
}
