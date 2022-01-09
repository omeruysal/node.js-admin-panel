import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Role } from '../entity/role.entity';

export const Roles = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Role);

    res.send(await repository.find());
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const CreateRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;

    const repository = getManager().getRepository(Role);

    const role = await repository.save({
      name,
      permissions: permissions.map((id) => ({ id })),
    });

    res.status(201).send(role);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const GetRole = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Role);

    res.send(await repository.findOne(req.params.id, { relations: ['permissions'] }));
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const UpdateRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;

    const repository = getManager().getRepository(Role);
    //If we pass the id property to save method, then it acts like update, if we do not then it acts like save
    const role = await repository.save({
      id: parseInt(req.params.id),
      name,
      permissions: permissions.map((id) => ({ id })),
    });

    res.status(202).send(role);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const DeleteRole = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Role);

    await repository.delete(req.params.id);

    res.status(204).send(null);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
