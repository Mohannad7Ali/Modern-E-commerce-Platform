import OrderRepository from './order.repository';
import OrderService from './order.service';
import OrderController from './order.controller';

export default function makeOrderController() {
  const orderRepository = new OrderRepository();
  const orderService = new OrderService(orderRepository);
  const orderController = new OrderController(orderService);
  return orderController;
}
