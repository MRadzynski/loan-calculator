import { checkAuth } from './middlewares/checkAuth';
import { checkDatabase } from './utils/checkDatabase';
import { logger } from './middlewares/logger';
import authRoutes from './routes/authRoutes';
import express from 'express';
import loanRoutes from './routes/loanRoutes';
import passport from './auth/auth';
import session from 'express-session';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(logger);

// Health check
app.get('/ping', checkAuth, (_req, res) => {
  res.send('pong');
});

app.use('/api/auth', authRoutes);
app.use('/api/loan', checkAuth, loanRoutes);

const startServer = async () => {
  await checkDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

export default app;
