import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecretkey';

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};
