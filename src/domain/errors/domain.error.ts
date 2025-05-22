export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InsufficientFundsError extends DomainError {
  constructor(message = 'Insufficient funds') {
    super(message);
  }
}

export class AccountNotFoundError extends DomainError {
  constructor(message = 'Account not found') {
    super(message);
  }
}

export class InvalidOperationError extends DomainError {
  constructor(message = 'Invalid operation') {
    super(message);
  }
}
