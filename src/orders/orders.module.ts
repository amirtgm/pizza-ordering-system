import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bull';
import { OrdersProcessor } from './processor/orders.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({
      name: 'order-queue',
    }),
  ],
  providers: [OrdersService, PrismaService, OrdersProcessor],
  controllers: [OrdersController],
})
export class OrdersModule {}
