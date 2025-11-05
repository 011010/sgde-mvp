import { env } from "@/config/env.config";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = env.app.isDevelopment;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context, null, 2) : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr ? `\nContext: ${contextStr}` : ""}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case "info":
        // eslint-disable-next-line no-console
        console.log(formattedMessage);
        break;
      case "warn":
        console.warn(formattedMessage);
        break;
      case "error":
        console.error(formattedMessage);
        break;
      case "debug":
        if (this.isDevelopment) {
          // eslint-disable-next-line no-console
          console.log(formattedMessage);
        }
        break;
    }
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    };
    this.log("error", message, errorContext);
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }
}

export const logger = new Logger();
