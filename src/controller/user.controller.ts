import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';

export const Users = async (req: Request, res: Response) => {
  try {
    console.log(req.session.browser);

    const repository = getManager().getRepository(User);

    const users = await repository.find();
    res.status(200).send(
      users.map((user) => {
        const { password, ...data } = user;
        return data;
      })
    );
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
