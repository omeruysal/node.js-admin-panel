import express, { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from '../controller/auth.controller';
import { Upload } from '../controller/image.controller';
import { Chart, Export, Orders } from '../controller/order.controller';
import { Permissions } from '../controller/permission.controller';
import { Products, CreateProduct, GetProduct, UpdateProduct, DeleteProduct } from '../controller/product.controller';
import { CreateRole, DeleteRole, GetRole, Roles, UpdateRole } from '../controller/role.controller';
import { CreateUser, DeleteUser, GetUser, UpdatedUser, Users } from '../controller/user.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PermissionMiddleware } from '../middleware/permission.middleware';

export const routes = (router: Router) => {
  router.post('/api/register', Register);
  router.post('/api/login', Login);
  router.get('/api/user', AuthMiddleware, AuthenticatedUser);
  router.post('/api/logout', AuthMiddleware, Logout);
  router.put('/api/user/info', AuthMiddleware, UpdateInfo);
  router.put('/api/user/password', AuthMiddleware, UpdatePassword);

  router.get('/api/users', AuthMiddleware, PermissionMiddleware('users'), Users);
  router.post('/api/users', AuthMiddleware, PermissionMiddleware('users'), CreateUser);
  router.get('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), GetUser);
  router.put('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), UpdatedUser);
  router.delete('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), DeleteUser);

  router.get('/api/permissions', AuthMiddleware, Permissions);

  router.get('/api/roles', AuthMiddleware, PermissionMiddleware('roles'), Roles);
  router.post('/api/roles', AuthMiddleware, PermissionMiddleware('roles'), CreateRole);
  router.get('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), GetRole);
  router.put('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), UpdateRole);
  router.delete('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), DeleteRole);

  router.get('/api/products', AuthMiddleware, PermissionMiddleware('products'), Products);
  router.post('/api/products', AuthMiddleware, PermissionMiddleware('products'), CreateProduct);
  router.get('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), GetProduct);
  router.put('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), UpdateProduct);
  router.delete('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), DeleteProduct);

  router.post('/api/upload', AuthMiddleware, PermissionMiddleware('products'), Upload);
  router.use('/api/uploads', express.static('./uploads'));

  router.get('/api/orders', AuthMiddleware, PermissionMiddleware('orders'), Orders);
  router.post('/api/export', AuthMiddleware, PermissionMiddleware('orders'), Export);
  router.get('/api/chart', AuthMiddleware, PermissionMiddleware('orders'), Chart);
};

// 1-Register oluyoruz role eklemeden
// http://localhost:8080/api/register
// {
//   "firstName":"testName",
//   "lastName":"testLastName",
//   "email":"test@gmail.com",
//   "password" : "123",
//   "passwordConfirm": "123"
// }

// 2-Login oluyoruz ve jwt cookiye ekleniyor
// http://localhost:8080/api/login
// {
//   "email":"test@gmail.com",
//   "password" : "123",
// }

//  3-Istegimiz bir rolu almak icin guncelleme yapiyoruz put istegi ile
//  http://localhost:8080/api/user/info
// {
//   "role": {
//       "id": 1,
//       "name": "Admin"
//        }
// }
