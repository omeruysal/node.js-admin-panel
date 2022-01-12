import { createConnection, getManager } from 'typeorm';
import { randomInt } from 'crypto';
import { Order } from '../src/entity/order.entity';
import { OrderItem } from '../src/entity/order-item.entity';
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

createConnection().then(async (connection) => {
  const orderRepository = getManager().getRepository(Order);
  const orderItemRepository = getManager().getRepository(OrderItem);

  for (let i = 0; i < 30; i++) {
    const order = await orderRepository.save({
      first_name: 'user_' + i,
      last_name: 'lastname_' + i,
      email: 'user_' + i + '@mail.com',
      created_at: randomDate(new Date(2020, 0, 1), new Date()).toString(),
    });

    for (let j = 0; j < randomInt(1, 5); j++) {
      await orderItemRepository.save({
        order,
        product_title: 'order_' + i,
        price: randomInt(10, 100),
        quantity: randomInt(1, 5),
      });
    }
  }

  process.exit(0);
});
