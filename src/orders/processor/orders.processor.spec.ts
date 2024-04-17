import { Test, TestingModule } from '@nestjs/testing';
import { OrdersProcessor } from './orders.processor';
import { OrdersService } from '../orders.service';
import { Job } from 'bull';

describe('OrdersProcessor', () => {
  let processor: OrdersProcessor;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersProcessor,
        {
          provide: OrdersService,
          useValue: {
            updateOrderStatus: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    processor = module.get<OrdersProcessor>(OrdersProcessor);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
    expect(ordersService).toBeDefined();
  });

  it('should handle state transition correctly', async () => {
    const jobMock = {
      data: { orderId: '123', newStatus: 'Ready for Pickup' },
    } as Job;
    await processor.handleStateTransition(jobMock);
    expect(ordersService.updateOrderStatus).toHaveBeenCalledWith(
      '123',
      'Ready for Pickup',
    );
  });

  it('should handle errors during state transition', async () => {
    jest
      .spyOn(ordersService, 'updateOrderStatus')
      .mockRejectedValueOnce(new Error('Something went wrong'));
    const jobMock = { data: { orderId: '123', newStatus: 'Invalid' } } as Job;
    const result = await processor.handleStateTransition(jobMock);
    expect(result.success).toBeFalsy();
    expect(result.error).toBe('Something went wrong');
  });
});
