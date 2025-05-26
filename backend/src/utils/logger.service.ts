import { LogLevel } from '@nestjs/common';

export class LoggerService {
  private static context?: string;
  private static logLevels: LogLevel[] = [
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
  ];

  static setContext(context: string) {
    this.context = context;
    return this;
  }

  static setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
    return this;
  }

  private static isLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  private static formatMessage(message: any, context?: string): string {
    const formattedContext = context || this.context || 'Application';
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${formattedContext}] ${message}`;
  }

  static debug(message: any, context?: string): void {
    if (this.isLevelEnabled('debug')) {
      console.debug(this.formatMessage(message, context));
    }
  }

  static verbose(message: any, context?: string): void {
    if (this.isLevelEnabled('verbose')) {
      console.log(this.formatMessage(message, context));
    }
  }

  static log(message: any, context?: string): void {
    if (this.isLevelEnabled('log')) {
      console.log(this.formatMessage(message, context));
    }
  }

  static warn(message: any, context?: string): void {
    if (this.isLevelEnabled('warn')) {
      console.warn(this.formatMessage(message, context));
    }
  }

  static error(message: any, trace?: string, context?: string): void {
    if (this.isLevelEnabled('error')) {
      console.error(this.formatMessage(message, context));
      if (trace) {
        console.error(trace);
      }
    }
  }
}
