import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { stateTransitions } from 'src/constants/order.constant';
import { PrismaService } from 'src/prisma.service';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue('order-queue') private orderQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  public async requestStatusUpdate(orderId: string, newStatus: string) {
    try {
      await this.orderQueue.add('update-status', {
        orderId,
        newStatus,
      });
    } catch (error) {
      console.error('Failed to request status update:', error);
    }
  }
  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    console.log(`Request to update order ${orderId} to status ${newStatus}`);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }
    console.log(stateTransitions[order.status]);
    if (!stateTransitions[order.status].includes(OrderStatus[newStatus])) {
      throw new Error(
        `Transition from ${OrderStatus[order.status]} to ${newStatus} is not allowed.`,
      );
    }

    if (newStatus === OrderStatus.Cancelled && !this.canCancelOrder(order)) {
      throw new Error('Order cannot be cancelled at this stage.');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    console.log(
      `Order status updated: ${updatedOrder.id} is now ${updatedOrder.status}`,
    );
    return updatedOrder;
  }

  async findAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }
  async createOrder(order: Partial<Order>): Promise<Order> {
    console.log('creating order', order);
    return await this.prisma.order.create({
      data: {
        status: OrderStatus.Pending,
        details: order.details,
      },
    });
  }

  canCancelOrder(order: Order): boolean {
    return OrderStatus[order.status] === OrderStatus.Pending;
  }
  // Validate transitions
  validateTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): boolean {
    const allowedTransitions = stateTransitions[currentStatus];
    if (Array.isArray(allowedTransitions)) {
      return allowedTransitions.includes(OrderStatus[newStatus]);
    }
    return false;
  }
}
