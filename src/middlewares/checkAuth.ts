import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(HttpStatusCode.Unauthorized).json({ error: 'Unauthorized' });
    return;
  }

  next();
};
