import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';

export const Users = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(User);

    const users = await repository.find({
      relations: ['role'], //We should add this parameter if we want to get relational objects too. The keyword must match with the name which field name of user entity
    });
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

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { role_id, ...body } = req.body;

    const hashedPassword = await bcryptjs.hash('12345', 10);

    const repository = getManager().getRepository(User);

    const { password, ...user } = await repository.save({
      ...body,
      password: hashedPassword,
      role: { id: role_id },
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const GetUser = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(User);

    const user = await repository.findOne(req.params.id, {
      relations: ['role'],
    });

    if (!user) {
      res.send({
        message: 'User is not exist',
      });
    }
    let { password, ...data } = user;

    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const UpdatedUser = async (req: Request, res: Response) => {
  try {
    const { role_id, ...body } = req.body;

    const repository = getManager().getRepository(User);

    await repository.update(req.params.id, {
      ...body,
      role: { id: role_id },
    });

    const { password, ...user } = await repository.findOne(req.params.id);

    res.status(202).send(user);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(User);

    await repository.delete(req.params.id);

    res.status(204).send(null);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
