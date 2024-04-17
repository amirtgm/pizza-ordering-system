import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderStatus, Order as PrismaOrder } from '@prisma/client';
import { OrderInputDto, OrderResponseDto } from './dto/order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of all orders',
    type: [OrderResponseDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to retrieve orders' })
  async getAllOrders(): Promise<PrismaOrder[]> {
    try {
      return await this.ordersService.findAllOrders();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    description: 'Order details',
    type: OrderInputDto,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to create order' })
  async createOrder(@Body('details') details: string): Promise<PrismaOrder> {
    try {
      return await this.ordersService.createOrder({ details });
    } catch (error) {
      throw new HttpException('Failed to create order', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change the status of an order' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: String,
  })
  @ApiBody({ description: 'New status of the order', type: OrderInputDto })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to update order status' })
  async changeOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    try {
      await this.ordersService.requestStatusUpdate(id, status);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
