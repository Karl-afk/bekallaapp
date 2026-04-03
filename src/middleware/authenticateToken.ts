import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { HttpException } from '../types/HttpException';

const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecretkey';
const exceptionTitle = 'Authentication Error';
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) throw new HttpException(401, 'Access Denied', exceptionTitle);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) throw new HttpException(401, 'Invalid Token', exceptionTitle);
    req.user = user;
    next();
  });
};
