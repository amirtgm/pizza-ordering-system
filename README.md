# Pizza Ordering System

This backend service manages a pizza ordering system, employing NestJS, Prisma with PostgreSQL, and Bull with Redis for asynchronous order state transitions. It supports creating, updating, and viewing orders and is designed to operate in Dockerized environments.

## Overview

To handle numerous state transitions across different applications, a queue system utilizing Redis and Bull was implemented. This system allows for asynchronous state transitions, which means state transitions are not immediately reflected in API responses and require additional handling.

State transitions are managed using an object mapping defined in `src/constants/order.constant.ts` as follows:

```ts
export const stateTransitions = {
  [OrderStatus.Pending]: [OrderStatus.InPreparation, OrderStatus.Cancelled],
  [OrderStatus.InPreparation]: [OrderStatus.ReadyForPickup],
  [OrderStatus.ReadyForPickup]: [OrderStatus.Completed],
  [OrderStatus.Completed]: [],
  [OrderStatus.Cancelled]: [],
};
```

Transitions must adhere to specified conditions and utilize constants from the `OrderStatus` enum sourced from the database.

## Features

- **REST API** for order management.
- **Swagger Documentation** for API details, accessible at `localhost:3000/api`.
- **State Machine** for managing order statuses.
- **Prisma ORM** for database management.
- **Docker Compose** for orchestrating local development environments with PostgreSQL and Redis.
- **Bull Queue** for processing state transitions.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 16.x or newer)
- [Docker](https://www.docker.com/products/docker-desktop)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)

## Setup Guide

To set up your local development environment, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/pizza-ordering-system.git
   cd pizza-ordering-system
   ```

2. Initialize required services (PostgreSQL and Redis):

   ```bash
   npm run setup:docker
   ```

3. Perform initial migrations (only required once):

   ```bash
   npm run setup:prisma:migrate
   ```

4. Alternatively, set up Prisma types if migrations are completed:

   ```bash
   npm run setup:prisma
   ```

5. Start the application:

   ```bash
   npm start
   ```

## Future Enhancements

Given more time, potential improvements include:

1. defienetly would follow git commit structure but didn't have much time.
2. Enhanced setup with environment variables and security measures.
3. Added testing for controllers and services.
4. Fallback mechanisms for failed jobs due to database errors.
5. A notification system for state transitions.
6. Advanced error handling with middleware.
