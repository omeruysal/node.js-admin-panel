import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';

export const Users = async (req: Request, res: Response) => {
  const take = 15;
  const page = parseInt((req.query.page as string) || '1'); // We cast as string because req.query.page might take various types

  const repository = getManager().getRepository(User);

  const [data, total] = await repository.findAndCount({
    take,
    skip: (page - 1) * take,
    relations: ['role'], //We should add this parameter if we want to get relational objects too. The keyword must match with the name which field name of user entity
  });

  res.send({
    data: data.map((u) => {
      const { password, ...data } = u;

      return data;
    }),
    meta: {
      total,
      page,
      last_page: Math.ceil(total / take),
    },
  });
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
    const updateBody = {
      ...body,
    };
    if (role_id) {
      // We add role_id property if role_id is updated too
      updateBody.role = { id: role_id };
    }

    await repository.update(req.params.id, updateBody);

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
