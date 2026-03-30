import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

type TokenContext = 'access' | 'refresh';

export function generateToken(user: User, context: TokenContext = 'access') {
  const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecretkey';
  let expiresIn: jwt.JwtPayload['expiresIn'] = '1m';
  if (context === 'refresh') {
    expiresIn = '7d';
  }

  const token = jwt.sign(
    { id: user.id, username: user.name, email: user.email },
    SECRET_KEY as jwt.Secret,
    { expiresIn },
  );

  return token;
}

export function verifyToken(token: string, context: TokenContext = 'access') {
  const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecretkey';
  try {
    const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret);
    return decoded;
  } catch (err) {
    return null;
  }
}
