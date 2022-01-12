import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Product } from '../entity/product.entity';

export const Products = async (req: Request, res: Response) => {
  try {
    const take = 15;
    const page = parseInt((req.query.page as string) || '1');

    const repository = getManager().getRepository(Product);

    const [data, total] = await repository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    res.send({
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const CreateProduct = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Product);

    const product = await repository.save(req.body);

    res.status(201).send(product);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const GetProduct = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Product);

    res.send(await repository.findOne(req.params.id));
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const UpdateProduct = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Product);

    await repository.update(req.params.id, req.body);

    res.status(202).send(await repository.findOne(req.params.id));
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const DeleteProduct = async (req: Request, res: Response) => {
  try {
    const repository = getManager().getRepository(Product);

    await repository.delete(req.params.id);

    res.status(204).send(null);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
