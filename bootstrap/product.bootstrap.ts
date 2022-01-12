import { createConnection, getManager } from 'typeorm';
import { Product } from '../src/entity/product.entity';
import { randomInt } from 'crypto';

createConnection().then(async (connection) => {
  const repository = getManager().getRepository(Product);

  for (let i = 0; i < 30; i++) {
    await repository.save({
      title: 'title_' + i,
      description: 'description_' + i,
      image: 'image_' + i,
      price: randomInt(10, 100),
    });
  }

  process.exit(0);
});
