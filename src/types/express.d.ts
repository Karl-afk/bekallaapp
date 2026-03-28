import { Request } from 'express';

type tokenUser = {
  id: string;
  email: string;
  password: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: tokenUser;
    }
  }
}
