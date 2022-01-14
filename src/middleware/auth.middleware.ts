import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
declare module 'express-session' {
  interface SessionData {
    browser: string;
  }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('user browser : ' + req.session.browser);
    //Cookieden jwt token cekilir
    const jwt = req.cookies['jwt'];

    //jwt saglamasi yapilir
    const payload: any = verify(jwt, process.env.SECRET_KEY);

    //Eger payload yoksa jwt yok demektir ve unauthenticated uyarisi doneriz
    if (!payload) {
      return res.status(401).json({
        message: 'unauthenticated',
      });
    }
    //Sessionda jwt var, fakat browser bilgileri ayni degil ise :
    // Sessionda browser bilgisi var ve requestten gelen browser bilgisi ile sessiondaki browser bilgisi ayni degil ise, unauthenticated uyarisi doneriz
    if (req.session.browser !== undefined && req.session.browser !== req.headers['user-agent']) {
      return res.status(401).json({
        message: 'unauthenticated',
      });
    }
    const repository = getManager().getRepository(User);
    req['user'] = await repository.findOne(payload.id);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'unauthenticated',
    });
  }
};
