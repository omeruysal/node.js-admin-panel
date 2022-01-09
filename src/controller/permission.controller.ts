import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Permission } from '../entity/permission.entity';

export const Permissions = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Permission);

    res.send(await repository.find());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
