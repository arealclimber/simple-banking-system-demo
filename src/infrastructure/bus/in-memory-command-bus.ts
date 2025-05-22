import { Injectable } from '@nestjs/common';
import { Command } from '../../domain/interfaces/command.interface';
import { CommandBus } from './command-bus.interface';

@Injectable()
export class InMemoryCommandBus implements CommandBus {
  private handlers = new Map<string, (command: Command) => Promise<void>>();

  async execute<T extends Command>(command: T): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command type ${command.type}`);
    }

    return handler(command);
  }

  register(
    commandType: string,
    handler: (command: Command) => Promise<void>,
  ): void {
    if (this.handlers.has(commandType)) {
      throw new Error(
        `Handler already registered for command type ${commandType}`,
      );
    }
    this.handlers.set(commandType, handler);
  }
}
