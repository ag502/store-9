import { EntityRepository, In, Repository, Not } from 'typeorm';
import { OrderStatus } from '../../../shared/dtos/order/schema';
import Order from '../entities/order';
import OrderItem from '../entities/order_item';

@EntityRepository(Order)
export default class OrderRepository extends Repository<Order> {
  async getList({
    userId,
    page = 0,
    size = 5,
    startDate = new Date(0),
    endDate = new Date(),
  }: {
    userId: number;
    status?: OrderStatus;
    size?: number;
    page?: number;
    startDate?: Date | string;
    endDate?: Date | string;
  }) {
    const start = new Date(new Date(startDate).setHours(0, 0, 0, 0)).toJSON();
    const end = new Date(new Date(endDate).setHours(23, 59, 59, 59)).toJSON();

    const orders = await this.query(`
      SELECT a.*, b.id AS is_reviewed
      FROM
      (SELECT o.*, p.id as product_id, p.name, p.thumbnail, p.price, oi.amount
        FROM orders o
        INNER JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ${userId}
      ) a LEFT JOIN (SELECT r.* FROM reviews r WHERE r.user_id = ${userId}) b
      ON a.product_id = b.product_id
      WHERE DATE(a.updated_at) BETWEEN '${start}' AND '${end}'
      AND a.status != '${OrderStatus.IN_CART}'
      ORDER BY updated_at DESC
      LIMIT ${size}
      OFFSET ${page * size}
    `);

    const totalCount = await this.query(`
      SELECT count(joi.id) AS count 
      FROM orders o
      LEFT JOIN (
        SELECT *
        FROM order_items
      ) joi
      ON o.id = joi.order_id
      WHERE o.user_id = ${userId} AND DATE(o.updated_at) BETWEEN '${start}' AND '${end}'
      AND o.status != '${OrderStatus.IN_CART}'
      GROUP BY o.user_id
    `);

    return { orders, totalCount: Number(totalCount[0]?.count) };
  }

  async order({
    id,
    userId,
    buyerName,
    phone,
    email,
    receiverName,
    receiverAddress,
    receiverPhone,
    selectedItem,
  }: {
    id: number;
    userId: number;
    buyerName: string;
    phone: string;
    email: string;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    selectedItem: number[];
  }) {
    const result = this.createQueryBuilder()
      .update({
        status: OrderStatus.PURCHASING_COMPLETE,
        buyerName,
        phone,
        email,
        receiverName,
        receiverAddress,
        receiverPhone,
      })
      .where(`user_id = ${userId}`)
      .andWhere(`id = ${id}`)
      .execute();

    const deletedProducts = await this._removeExceptCartItem(selectedItem);

    await this._addCartItems(userId, deletedProducts);

    return result;
  }

  getCart({ userId }: { userId: number }) {
    const result = this.createQueryBuilder('o')
      .where(`o.user_id = ${userId} AND o.status = '${OrderStatus.IN_CART}'`)
      .leftJoinAndSelect('o.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .getOne();

    return result;
  }

  async addCartItem({
    productId,
    userId,
    amount,
  }: {
    productId: number;
    userId: number;
    amount: number;
  }) {
    const cart = await this._checkCart(userId);

    const isExist = await OrderItem.find({
      order_id: cart.id,
      product_id: productId,
    });

    if (isExist.length !== 0) {
      await this.updateCartItem({
        orderItemId: isExist[0].id,
        amount: amount + Number(isExist[0].amount),
      });
      return await OrderItem.findOne({
        order_id: cart.id,
        product_id: productId,
      });
    }

    return OrderItem.create({
      amount,
      order_id: cart.id,
      product_id: productId,
    }).save();
  }

  async updateCartItem({ orderItemId, amount }: { orderItemId: number; amount: number }) {
    const result = await OrderItem.createQueryBuilder('oi')
      .update({
        amount,
      })
      .whereInIds(orderItemId)
      .execute();

    return result;
  }

  async removeCartItem({ orderItemId }: { orderItemId: number[] }) {
    const result = await OrderItem.delete(orderItemId);

    return result;
  }

  async _removeExceptCartItem(orderItemId: number[]) {
    const order = await OrderItem.find({ where: { id: In(orderItemId) } });

    const deletedProducts = await OrderItem.find({
      where: { order_id: order[0]['order_id'], id: Not(In([orderItemId])) },
    });
    const result = await OrderItem.remove(deletedProducts);

    return deletedProducts;
  }

  async _checkCart(userId: number) {
    let cart = await this.createQueryBuilder('o')
      .where(`o.user_id = ${userId} AND o.status = '${OrderStatus.IN_CART}'`)
      .getOne();

    if (!cart) {
      cart = await this.create({ user_id: userId, status: OrderStatus.IN_CART }).save();
    }
    return cart;
  }

  async _addCartItems(userId, deletedProducts) {
    const cart = await this._checkCart(userId);

    const cartInfo = deletedProducts.map(({ product_id, amount }) => ({
      product_id,
      order_id: cart.id,
      amount,
      user_id: userId,
    }));

    const result = await OrderItem.createQueryBuilder().insert().values(cartInfo).execute();

    return result;
  }
}
