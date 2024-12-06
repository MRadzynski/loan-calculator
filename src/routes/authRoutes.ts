import { checkAuth } from '../middlewares/checkAuth';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureMessage: true,
    failureRedirect: '/'
  })
);

router.get('/logout', checkAuth, (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    res.redirect('/');
  });
});

export default router;
