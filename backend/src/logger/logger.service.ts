import { Injectable, LogLevel, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;
  private logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

  setContext(context: string): this {
    this.context = context;
    return this;
  }

  setLogLevels(levels: LogLevel[]): this {
    this.logLevels = levels;
    return this;
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  private formatMessage(message: any, context?: string): string {
    const formattedContext = context || this.context || 'Application';
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${formattedContext}] ${message}`;
  }

  debug(message: any, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      console.debug(this.formatMessage(message, context));
    }
  }

  verbose(message: any, context?: string): void {
    if (this.isLevelEnabled('verbose')) {
      console.log(this.formatMessage(message, context));
    }
  }

  log(message: any, context?: string): void {
    if (this.isLevelEnabled('log')) {
      console.log(this.formatMessage(message, context));
    }
  }

  warn(message: any, context?: string): void {
    if (this.isLevelEnabled('warn')) {
      console.warn(this.formatMessage(message, context));
    }
  }

  error(message: any, trace?: string, context?: string): void {
    if (this.isLevelEnabled('error')) {
      console.error(this.formatMessage(message, context));
      if (trace) {
        console.error(trace);
      }
    }
  }
}
