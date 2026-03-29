import { Router } from 'express';
import { generateToken } from '../helper/tokenHelper';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';

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
    const token = generateToken(existintUser);
    return res.json({ token, message: 'successfully logged in' });
  }
  res.status(400).json({ message: 'Invalid credentials' });
});

export default authRouter;
