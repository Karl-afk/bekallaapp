import { Router } from 'express';
import { generateToken, verifyToken } from '../helper/tokenHelper';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { authenticateToken } from '../middleware/authenticateToken';

const authRouter = Router();
const registerActive = process.env.REGISTER_ACTIVE || 'false';

if (registerActive !== 'false') {
  authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(422);
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.create({
      name,
      email,
      password: hashedPassword,
    });
    const saved = await userRepo.save(user);

    const token = generateToken(saved);
    res.status(201).json({ message: 'User registered', token });
  });
}

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422);
  const userRepo = AppDataSource.getRepository(User);
  const existintUser = await userRepo.findOneBy({ email: email });

  if (existintUser && (await bcrypt.compare(password, existintUser.password))) {
    const token = generateToken(existintUser, 'access');
    const refreshToken = generateToken(existintUser, 'refresh');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ token, message: 'successfully logged in' });
  }
  res.status(400).json({ message: 'Invalid credentials' });
});

authRouter.get('/me', authenticateToken, async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const userRepo = AppDataSource.getRepository(User);
  const dbuser = await userRepo.findOneBy({ id: user.id });
  if (!dbuser) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ user: user });
});

authRouter.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: 'No refresh token' });

  var decoded = verifyToken(refreshToken, 'refresh');
  if (!decoded || typeof decoded === 'string')
    return res.status(403).json({ message: 'Invalid token' });

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: decoded.id });
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const newToken = generateToken(user, 'access');
  const newRefreshToken = generateToken(user, 'refresh');

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ token: newToken, message: 'Token refreshed' });
});

export default authRouter;
