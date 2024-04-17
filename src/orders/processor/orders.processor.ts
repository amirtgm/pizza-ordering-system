import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrdersService } from '../orders.service';

@Processor('order-queue')
export class OrdersProcessor {
  constructor(private readonly ordersService: OrdersService) {}

  @Process('update-status')
  async handleStateTransition(job: Job) {
    const { orderId, newStatus } = job.data;
    try {
      await this.ordersService.updateOrderStatus(orderId, newStatus);
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      return { success: true, orderId, newStatus };
    } catch (error) {
      console.error(
        `Failed to update order status for ${orderId}: ${error.message}`,
      );
      return { success: false, error: error.message };
    }
  }
}
