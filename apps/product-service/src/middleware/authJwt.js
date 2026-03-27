import jwt from 'jsonwebtoken';
import config from '../config.js';

export function authJwt(req, res, next) {
  // Reads the Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }

  // Parses the Bearer token
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.sendStatus(401); // Unauthorized
  }

  // Verifies the JWT
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = decoded;
    return next();
  });
}
