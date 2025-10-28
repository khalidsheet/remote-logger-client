import { isDev } from "./utils.js";

type LogPayload = {
  app: string;
  message: any[];
  caller: string;
};

type NoOpLogger = {
  log: (...args: any[]) => void;
};

export class RemoteLoggerClient {
  private ws: WebSocket | null = null;
  private retryTimer: any = null;

  constructor(
    private readonly app: string = "default",
    private readonly port: number = 4455
  ) {
    this.connect();
  }

  public log(...args: any[]): this {
    const caller = this.getCaller();
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log(...args);
      return this;
    }

    const payload: LogPayload = { app: this.app, message: args, caller };
    this.ws.send(JSON.stringify(payload, null, 2));

    return this;
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(`ws://localhost:${this.port}`);
      this.ws.onopen = () => {
        console.log(`[remote-logger-client] [${this.app}] Connected.`);
      };
      this.ws.onclose = this.retry.bind(this);
      this.ws.onerror = this.retry.bind(this);
    } catch {
      this.retry();
    }
  }

  private retry(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    this.retryTimer = setTimeout(() => {
      this.connect();
    }, 3000);
  }

  private getCaller(): string {
    const stack = new Error().stack;
    if (!stack) return "Unknown";
    const lines = stack.split("\n");
    const target =
      lines.findLast?.(
        (line) => line.includes("at ") && !line.includes("RemoteLoggerClient")
      ) ||
      lines
        .reverse()
        .find(
          (line) => line.includes("at ") && !line.includes("RemoteLoggerClient")
        );

    if (!target) return "Unknown";
    const match = target.match(
      /\(?((http|https|file):\/\/[^\s)]+):(\d+):(\d+)\)?/
    );
    if (!match) return target.trim();
    const [, fileName, , lineNumber, columnNumber] = match;
    return `${fileName}:${lineNumber}:${columnNumber}`;
  }
}

export function createLogger(
  app: string = "default",
  port: number = 4455
): RemoteLoggerClient | NoOpLogger {
  if (!isDev()) {
    return {
      log: (...args: any[]) => {},
    } as NoOpLogger;
  }

  return new RemoteLoggerClient(app, port);
}
