import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/User.js';

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return res.json({ token });
}
