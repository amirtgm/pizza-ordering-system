import { OrderStatus } from '@prisma/client';

export const stateTransitions = {
  [OrderStatus.Pending]: [OrderStatus.InPreparation, OrderStatus.Cancelled],
  [OrderStatus.InPreparation]: [OrderStatus.ReadyForPickup],
  [OrderStatus.ReadyForPickup]: [OrderStatus.Completed],
  [OrderStatus.Completed]: [],
  [OrderStatus.Cancelled]: [],
};
