import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export function generateToken(user: User) {
  const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecretkey';
  const token = jwt.sign(
    { id: user.id, username: user.name, email: user.email },
    SECRET_KEY as jwt.Secret,
    { expiresIn: '15m' },
  );

  return token;
}
