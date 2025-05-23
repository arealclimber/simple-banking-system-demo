- [🏦 Simple Banking System - Technical Interview Project](#-simple-banking-system---technical-interview-project)
  - [⭐Overview](#overview)
    - [Technical Highlights](#technical-highlights)
    - [Complete Implementation Requirements](#complete-implementation-requirements)
    - [Why These Technologies?](#why-these-technologies)
  - [📚 Project Structure](#-project-structure)
  - [Quick Start \& Verification](#quick-start--verification)
    - [Method 1: Interactive API Testing with Swagger (Recommended)](#method-1-interactive-api-testing-with-swagger-recommended)
    - [Method 2: Automated Demo Script](#method-2-automated-demo-script)
    - [Method 3: Docker Deployment](#method-3-docker-deployment)
    - [Method 4: Complete Test Suite](#method-4-complete-test-suite)
  - [🏗️ Technical Architecture Design](#️-technical-architecture-design)
    - [Core Architecture Pattern](#core-architecture-pattern)
    - [Event Sourcing Advantages](#event-sourcing-advantages)
    - [Why Choose Event Sourcing?](#why-choose-event-sourcing)
  - [🧪 Testing \& Quality Assurance](#-testing--quality-assurance)
    - [Test Coverage](#test-coverage)
    - [Test Commands](#test-commands)
  - [🐳 Deployment \& Operations](#-deployment--operations)
    - [Docker Deployment](#docker-deployment)
    - [Production-Ready Features](#production-ready-features)
  - [📡 API Reference](#-api-reference)
    - [Starting the Service](#starting-the-service)
    - [Core API Endpoints](#core-api-endpoints)
      - [1. Create Account](#1-create-account)
      - [2. Deposit Operation](#2-deposit-operation)
      - [3. Withdrawal Operation](#3-withdrawal-operation)
      - [4. Transfer Operation](#4-transfer-operation)
      - [5. Query Account Balance](#5-query-account-balance)
      - [6. Query Transaction History](#6-query-transaction-history)
  - [🔧 Development Tools \& Workflow](#-development-tools--workflow)
    - [Code Quality Tools](#code-quality-tools)
    - [Development Best Practices](#development-best-practices)
  - [📈 Possible Future Features](#-possible-future-features)
    - [Phase 1: Production Transformation](#phase-1-production-transformation)
    - [Phase 2: Microservices](#phase-2-microservices)
    - [Phase 3: Cloud Native](#phase-3-cloud-native)

# 🏦 Simple Banking System - Technical Interview Project

> **Project Focus**: Banking system based on NestJS + Event Sourcing, implementing DDD architecture with concurrent-safe transfer operations and comprehensive transaction logging

## ⭐Overview

This project demonstrates a production-ready banking system with complete **interactive API documentation via Swagger UI**. You can test all endpoints directly from your browser at `http://localhost:3000/api` after starting the server.

### Technical Highlights

- **Event Sourcing + CQRS**: Complete audit trail with event replay support
- **DDD Hexagonal Architecture**: Pure business logic separated from infrastructure
- **Concurrency Safety**: Mutex locks preventing deadlocks + optimistic locking with version control
- **Type Safety**: Complete TypeScript type definitions with zero `any` types
- **Test-Driven Development**: 62 unit tests + 12 E2E tests, 95% coverage
- **Interactive API Documentation**: Swagger UI with live API testing capability

### Complete Implementation Requirements

| Requirement               | Implementation Solution       | Verification Method  |
| ------------------------- | ----------------------------- | -------------------- |
| ✅ RESTful API            | NestJS Controllers + Swagger  | Interactive API docs |
| ✅ Non-negative Balance   | Domain Aggregate Rules        | Unit test coverage   |
| ✅ CRUD Operations        | Complete Account Management   | E2E testing          |
| ✅ Transaction Log        | Event Sourcing Event Stream   | Demo script          |
| ✅ Atomic Transaction     | Mutex Lock + Event Store      | 100 concurrent test  |
| ✅ Unit/Integration Tests | Jest + Supertest              | Complete test suite  |
| ✅ Docker Deployment      | Multi-stage build             | Docker container     |
| ✅ In-Memory Storage      | Custom EventStore + ReadModel | Pure memory runtime  |

### Why These Technologies?

**NestJS**: Enterprise-grade Node.js framework with built-in DI container, modular architecture, and excellent TypeScript support  
**Event Sourcing**: Essential complete audit trail for financial systems, naturally supports concurrency and consistency  
**Domain-Driven Design**: Best practice for complex business logic, easy to test and maintain  
**Swagger/OpenAPI**: Provides interactive API documentation that allows immediate testing and exploration of all endpoints

---

## 📚 Project Structure

```
src/
├── domain/              # Domain layer (pure business logic)
│   ├── value-objects/   # Value objects (Money, AccountId)
│   ├── aggregates/      # Aggregate roots (AccountAggregate)
│   ├── events/          # Domain events
│   └── commands/        # Business commands
├── application/         # Application layer (use case orchestration)
│   ├── services/        # Application services (BankingService)
│   ├── buses/           # Command and event buses
│   └── projectors/      # Event projectors
├── infrastructure/      # Infrastructure layer
│   ├── event-store/     # Event storage
│   ├── read-model/      # Read models
│   └── mutex/           # Concurrency control
└── interfaces/          # Interface layer
    ├── controllers/     # REST API controllers
    ├── dto/             # Data transfer objects
    └── health/          # Health checks
```

## Quick Start & Verification

### Method 1: Interactive API Testing with Swagger (Recommended)

```bash
# Start the development server
npm install
npm run start:dev
```

**Access Swagger Documentation**: http://localhost:3000/api

- **Interactive API Testing**: Try all endpoints directly from the browser
- **Request/Response Examples**: See live data formats and validation rules
- **Schema Definitions**: Explore complete TypeScript types and constraints

### Method 2: Automated Demo Script

```bash
# Run complete feature demonstration
npm run demo
```

**Demo Features**:

- Create accounts and perform deposits, withdrawals, transfers
- Demonstrate transaction history queries (when, amount, toAccountId)
- Test limit and since query parameters
- Verify idempotency guarantees

### Method 3: Docker Deployment

```bash
# Build and start container
docker build -t banking-api .
docker run -d -p 3000:3000 --name banking-api banking-api

# Access APIs
curl http://localhost:3000/health
open http://localhost:3000/api  # Swagger documentation
```

### Method 4: Complete Test Suite

```bash
# Run all tests
npm run test        # 62 unit tests
npm run test:e2e    # 12 E2E tests
npm run test:cov    # Test coverage report
```

---

## 🏗️ Technical Architecture Design

### Core Architecture Pattern

```
┌─────────────────────┐
│   Interfaces       │  ← REST API (Controllers + DTOs)
│   (Port & Adapter) │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   Application      │  ← Use Cases (BankingService)
│   (Orchestration)  │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   Domain           │  ← Business Logic (Aggregates + Events)
│   (Pure Business)  │
└─────────┬───────────┘
          │
┌─────────▼───────────┐
│   Infrastructure   │  ← Event Store + Read Models
│   (Technical)      │
└─────────────────────┘
```

### Event Sourcing Advantages

**1. Complete Audit Trail**

```typescript
// Every business operation recorded as events
export class AccountCreatedEvent extends AbstractEvent {
  constructor(
    aggregateId: AccountId,
    public readonly accountName: string,
    public readonly initialBalance: Money,
    readonly occurredAt: TimestampInMillisecond = TimestampUtils.now(),
    readonly version: number = 1,
  ) {
    super(EventType.ACCOUNT_CREATED, aggregateId, occurredAt, version);
  }
}

export class MoneyTransferredEvent extends AbstractEvent {
  constructor(
    aggregateId: AccountId,
    public readonly amount: Money,
    public readonly toAccountId: AccountId,
    readonly occurredAt: TimestampInMillisecond = TimestampUtils.now(),
    readonly version: number = 1,
  ) {
    super(EventType.MONEY_TRANSFERRED, aggregateId, occurredAt, version);
  }
}
```

**2. Concurrent Safety Design**

```typescript
// Mutex lock implementation in transfer service
async transfer(
  sourceAccountId: AccountId,
  destinationAccountId: AccountId,
  amount: Money,
): Promise<void> {
  // Acquire locks for source and destination accounts
  const resourceIds = [
    sourceAccountId.toString(),
    destinationAccountId.toString(),
  ];

  // Acquire mutex locks (resources sorted lexicographically to avoid deadlock)
  const release = await this.mutexLockService.acquire(resourceIds);

  try {
    // Execute transfer
    const command = new TransferCommand(
      sourceAccountId,
      destinationAccountId,
      amount,
    );
    await this.commandBus.execute(command);
  } finally {
    // Ensure locks are released on transfer completion or error
    release();
  }
}
```

**3. Read-Write Separation Optimization**

```typescript
// Command side: Handle business logic
export class AccountAggregate {
  execute(command: Command): DomainEvent[] {
    switch (command.type) {
      case CommandType.CREATE_ACCOUNT:
        return this.handleCreateAccount(command as CreateAccountCommand);
      case CommandType.TRANSFER:
        return this.handleTransfer(command as TransferCommand);
      // ... other business logic
    }
  }

  private handleTransfer(command: TransferCommand): DomainEvent[] {
    this.guardSufficientFunds(command.amount);

    const event = new MoneyTransferredEvent(
      command.aggregateId,
      command.amount,
      command.destinationAccountId,
      command.timestamp,
      this.state.getVersion() + 1,
    );
    return [event];
  }
}

// Query side: Optimize query performance
@Injectable()
export class BalanceProjector implements OnModuleInit {
  onModuleInit() {
    // Subscribe to transfer events
    this.eventBus.subscribe(EventType.MONEY_TRANSFERRED, (event) => {
      const transferEvent = event as MoneyTransferredEvent;
      void this.handleTransferEvent(transferEvent);
    });
  }

  private async handleTransferEvent(
    event: MoneyTransferredEvent,
  ): Promise<void> {
    // Update source account balance
    const sourceAccount = await this.balanceReadModel.getAccount(
      event.aggregateId,
    );
    if (sourceAccount) {
      const newSourceBalance = sourceAccount.balance.subtract(event.amount);
      await this.balanceReadModel.upsertAccount(
        event.aggregateId,
        sourceAccount.name,
        newSourceBalance,
      );
    }

    // Update destination account balance
    const destinationAccount = await this.balanceReadModel.getAccount(
      event.toAccountId,
    );
    if (destinationAccount) {
      const newDestinationBalance = destinationAccount.balance.add(
        event.amount,
      );
      await this.balanceReadModel.upsertAccount(
        event.toAccountId,
        destinationAccount.name,
        newDestinationBalance,
      );
    }
  }
}
```

### Why Choose Event Sourcing?

1. **Financial System Requirements**: Banking operations need complete transaction history, naturally fulfilled by event sourcing
2. **Concurrency Handling**: Avoids lock contention issues of traditional CRUD, supports high-concurrency transactions
3. **Business Traceability**: Can replay system state at any point in time, facilitating auditing and debugging
4. **Evolution-Friendly**: Adding new features only requires new event handlers, doesn't affect existing code

---

## 🧪 Testing & Quality Assurance

### Test Coverage

- **Unit Tests**: 62 tests covering all business logic
- **End-to-End Tests**: 12 tests covering complete API workflows
- **Concurrency Tests**: 100 concurrent transfer operations stress test
- **Code Coverage**: 95% coverage including branch coverage

### Test Commands

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov

# Code linting
npm run lint

# Type checking
npm run typecheck
```

---

## 🐳 Deployment & Operations

### Docker Deployment

```bash
# Build image
docker build -t banking-api:latest .

# Run container
docker run -d -p 3000:3000 --name banking-api banking-api:latest

# Health check
curl http://localhost:3000/health
```

**If encountering container name conflict errors, please clean up existing containers first:**

```bash
# Stop and remove existing container
docker stop banking-api && docker rm banking-api

# Then run again
docker run -d -p 3000:3000 --name banking-api banking-api:latest
```

### Production-Ready Features

- **Multi-stage Docker Build**: Minimized image size
- **Health Check Endpoints**: Support for Kubernetes Probes
- **Structured Logging**: Facilitates monitoring and debugging
- **Graceful Shutdown**: Ensures complete request processing

---

## 📡 API Reference

### Starting the Service

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Docker mode
docker build -t banking-api . && docker run -p 3000:3000 banking-api
```

### Core API Endpoints

**Swagger Documentation**: http://localhost:3000/api

#### 1. Create Account

```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John'\''s Account",
    "initialBalance": { "amount": 1000 }
  }'

# Response example
{
  "id": "12345678-1234-1234-1234-123456789012",
  "message": "Account created successfully"
}
```

#### 2. Deposit Operation

```bash
curl -X POST http://localhost:3000/accounts/{accountId}/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500
  }'

# Response example
{
  "message": "Deposit successful"
}
```

#### 3. Withdrawal Operation

```bash
curl -X POST http://localhost:3000/accounts/{accountId}/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200
  }'

# Response example
{
  "message": "Withdrawal successful"
}
```

#### 4. Transfer Operation

```bash
curl -X POST http://localhost:3000/accounts/{sourceAccountId}/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "destinationAccountId": "{destinationAccountId}",
    "amount": { "amount": 300 }
  }'

# Response example
{
  "message": "Transfer successful"
}
```

#### 5. Query Account Balance

```bash
curl http://localhost:3000/accounts/{accountId}

# Response example
{
  "id": "12345678-1234-1234-1234-123456789012",
  "name": "John's Account",
  "balance": 800
}
```

#### 6. Query Transaction History

```bash
# Query all transactions
curl http://localhost:3000/accounts/{accountId}/transactions

# Paginated query (limit records)
curl http://localhost:3000/accounts/{accountId}/transactions?limit=5

# Time range query (millisecond timestamp)
curl http://localhost:3000/accounts/{accountId}/transactions?since=1640995200000

# Response example
[
  {
    "id": "tx-001",
    "type": "deposit",
    "amount": 500,
    "occurredAt": 1640995200000,
    "version": 2
  },
  {
    "id": "tx-002",
    "type": "transfer",
    "amount": 300,
    "toAccountId": "87654321-4321-4321-4321-210987654321",
    "occurredAt": 1640995260000,
    "version": 3
  }
]
```

---

## 🔧 Development Tools & Workflow

### Code Quality Tools

```bash
# Code formatting
npm run format

# Code linting
npm run lint

# Git hooks (Husky)
# - pre-commit: automatic lint and formatting
# - commit-msg: Conventional Commits specification
```

### Development Best Practices

- **Git Commit Standards**: Conventional Commits (feat, fix, refactor...)
- **Branching Strategy**: Git Flow, feature branch development
- **Code Review**: All changes require PR review
- **Test-First**: TDD development pattern, test coverage ≥ 90%

---

## 📈 Possible Future Features

### Phase 1: Production Transformation

- **PostgreSQL Event Store**: Persistence + high-performance indexing
- **Snapshot Mechanism**: Reduce event replay overhead
- **Distributed Locking**: Redis replacing in-memory locks

### Phase 2: Microservices

- **Service Decomposition**: Account service, transaction service, query service
- **Message Queues**: Kafka event publishing
- **API Gateway**: Unified entry point and rate limiting
- **Service Discovery**: Consul or Eureka

### Phase 3: Cloud Native

- **Kubernetes Deployment**: Auto-scaling and load balancing
- **Observability**: Prometheus + Grafana monitoring
- **Service Mesh**: Istio traffic management
- **Multi-cloud Deployment**: AWS, GCP, Azure support

---
