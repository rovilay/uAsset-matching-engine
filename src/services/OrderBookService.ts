import { Order, OrderSide, OrderStatus } from "./order.types";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderBookService {
  async addOrder(
    order: Omit<Order, "id" | "status" | "createdAt">
  ): Promise<Order> {
    const newOrder = await prisma.order.create({
        data: {
          id: uuidv4(),
          status: OrderStatus.OPEN,
          createdAt: new Date(),
          ...order,
        },
      }) as Order;

    return newOrder;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    await prisma.order.update({
        where: { id: orderId, status: OrderStatus.OPEN },
        data: { status: OrderStatus.CANCELLED },
    });

    return this.getOrder({ id: orderId })
  }

  async getOrders(where?: { [key in string]: any }, orderBy?: { price: 'desc' | 'asc'}): Promise<Order[]> {
    return await prisma.order.findMany({ 
      ...(where && { where } ),
      ...(orderBy && { orderBy } )
    }) as Order[];
  }

  async getOrder(where?: { [key in string]: any }): Promise<Order> {
    return await prisma.order.findFirst({ 
      ...(where && { where } ),
    }) as Order;
  }

  async startMatching(intervalMs: number = 5000): Promise<void> {
    setInterval(async () => {
      try {
        await this.matchOrders();
      } catch (error) {
        console.error("Error matching orders:", error);
      }
    }, intervalMs);
  }

  private async matchOrders(): Promise<void> {
    const buyOrders = (await this.getOrders(
      { side: OrderSide.BUY, status: OrderStatus.OPEN, quantity: { gt: 0 } }, 
      { price: 'desc' }
    ));
    const sellOrders = (await this.getOrders(
      { side: OrderSide.SELL, status: OrderStatus.OPEN, quantity: { gt: 0 } },
      { price: 'desc' }
    ))

    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        if (buyOrder.uassetSymbol === sellOrder.uassetSymbol && 
            buyOrder.price >= sellOrder.price) {
          const quantityFilled = Math.min(
            buyOrder.quantity,
            sellOrder.quantity
          );

          if (quantityFilled === 0) continue

          buyOrder.quantity -= quantityFilled;
          sellOrder.quantity -= quantityFilled;

          if (buyOrder.quantity === 0) {
            buyOrder.status = OrderStatus.FULFILLED;
          }
          if (sellOrder.quantity === 0) {
            sellOrder.status = OrderStatus.FULFILLED;
          }

          console.log(
            `Matched buy order ${buyOrder.id} with sell order ${sellOrder.id}, quantity: ${quantityFilled}`
          );

          await prisma.order.update({
            where: { id: buyOrder.id },
            data: {
              quantity: buyOrder.quantity,
              status: buyOrder.status,
            },
          });

          await prisma.order.update({
            where: { id: sellOrder.id },
            data: {
              quantity: sellOrder.quantity,
              status: sellOrder.status,
            },
          });

          if (buyOrder.quantity === 0) break;
        }
      }
    }
  }
}
