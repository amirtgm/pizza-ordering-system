// src/orders/dto/prisma-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the order' })
  id: number;

  @ApiProperty({
    example: OrderStatus.InPreparation,
    default: OrderStatus.Pending,
    enum: OrderStatus,
    description: 'The status of the order',
  })
  status: string;

  @ApiProperty({
    example: 'Details about the order',
    description: 'Order details',
  })
  details: string;

  // Add other properties that match the PrismaOrder type
}

export class OrderInputDto {
  @ApiProperty({
    example: OrderStatus.InPreparation,
    default: OrderStatus.Pending,
    enum: OrderStatus,
    description: 'The status of the order',
  })
  status?: string;

  @ApiProperty({
    example: 'Details about the order',
    description: 'Order details',
  })
  details?: string;

  // Add other properties that match the PrismaOrder type
}
