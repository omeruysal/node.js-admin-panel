import { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register } from '../controller/auth.controller';

export const routes = (router: Router) => {
  router.post('/api/register', Register);
  router.post('/api/login', Login);
  router.get('/api/user', AuthenticatedUser);
  router.post('/api/logout', Logout);
};
