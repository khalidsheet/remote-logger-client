# Remote Logger Client

A lightweight WebSocket client for sending logs to a remote logger server. Perfect for debugging frontend applications, mobile apps, or any JavaScript application where you need real-time log aggregation.

> **Note:** This client requires the [remote-logger-server](https://github.com/khalidsheet/remote-logger-server) to be running. This is a development tool intended for logging and debugging purposes.

## Features

- 🔄 **Auto-reconnect** - Automatically reconnects if the connection is lost (3-second retry)
- 📍 **Caller tracking** - Automatically captures file, line, and column information
- 🛡️ **Fallback behavior** - Falls back to `console.log` when disconnected
- 🚀 **Simple API** - Easy-to-use interface with method chaining
- 🎯 **Multi-app support** - Tag logs with application names for better organization
- 📦 **Zero configuration** - Works out of the box with sensible defaults

## Installation

```bash
npm install remote-logger-client
# or
pnpm add remote-logger-client
# or
yarn add remote-logger-client
```

## Prerequisites

Make sure you have the remote logger server running:

```bash
npm install -g remote-logger-server
remote-logger-server
```

The server will start on port `4455` by default.

## Usage

### Basic Usage

```javascript
import { createLogger } from "remote-logger-client";

const logger = createLogger("MyApp");

logger.log("Hello, world!");
logger.log("User logged in:", { userId: 123, username: "john" });
logger.log("API response:", response);
```

### Using the Class Directly

```javascript
import { RemoteLoggerClient } from "remote-logger-client";

const logger = new RemoteLoggerClient("MyApp", 4455);

logger.log("Application started");
```

### Method Chaining

```javascript
logger.log("Step 1 complete").log("Step 2 complete").log("All steps done!");
```

## API

### `createLogger(app, port)`

Factory function to create a new logger instance.

**Parameters:**

- `app` (string, optional) - Application name to identify logs. Default: `"default"`
- `port` (number, optional) - WebSocket server port. Default: `4455`

**Returns:** `RemoteLoggerClient` instance

**Example:**

```javascript
const logger = createLogger("MyApp", 4455);
```

### `new RemoteLoggerClient(app, port)`

Constructor for creating a logger instance directly.

**Parameters:**

- `app` (string, optional) - Application name. Default: `"default"`
- `port` (number, optional) - WebSocket server port. Default: `4455`

**Example:**

```javascript
const logger = new RemoteLoggerClient("MyApp", 4455);
```

### `logger.log(...args)`

Send logs to the remote server. Accepts any number of arguments of any type.

**Parameters:**

- `...args` (any[]) - Values to log (same as `console.log`)

**Returns:** `this` (for method chaining)

**Example:**

```javascript
logger.log("Simple message");
logger.log("Multiple", "arguments", 123, true);
logger.log("Object:", { foo: "bar" });
logger.log("Array:", [1, 2, 3]);
```

## How It Works

1. **Connection**: The client automatically connects to the WebSocket server on instantiation
2. **Logging**: When you call `logger.log()`, it sends the data to the server with:
   - Application name
   - Log message(s)
   - Caller information (file path, line, and column)
3. **Fallback**: If disconnected, logs are sent to `console.log` instead
4. **Auto-reconnect**: The client automatically attempts to reconnect every 3 seconds if the connection is lost

## Message Format

The client sends logs in the following JSON format:

```json
{
  "app": "MyApp",
  "message": ["Log message", { "data": "value" }],
  "caller": "http://localhost:3000/src/App.tsx:42:15"
}
```

## Server Output

When you send logs, they appear on the server console in this format:

```
12:34:56 PM [MyApp] [App.tsx:42:15] Log message { data: "value" }
```

## Configuration

### Custom Port

If your remote logger server is running on a different port:

```javascript
const logger = createLogger("MyApp", 8080);
```

### Multiple Applications

You can create separate loggers for different parts of your application:

```javascript
const authLogger = createLogger("Auth");
const apiLogger = createLogger("API");
const uiLogger = createLogger("UI");

authLogger.log("User logged in");
apiLogger.log("Fetching data from /api/users");
uiLogger.log("Modal opened");
```

## Browser Compatibility

Works in all modern browsers that support WebSocket:

- Chrome/Edge
- Firefox
- Safari
- Opera

## Requirements

- Modern JavaScript environment with WebSocket support
- Remote Logger Server running (usually on localhost:4455)

## Development

### Build

```bash
pnpm install
pnpm build
```

Builds the project using `tsdown` and outputs to the `dist/` directory in both CommonJS and ESM formats.

### Project Structure

```
remote-logger-client/
├── src/
│   └── main.ts          # Client implementation
├── dist/                # Built files
├── package.json
├── tsconfig.json
└── tsdown.config.ts     # Build configuration
```

## Troubleshooting

### Logs not appearing on the server

1. Make sure the remote logger server is running:

   ```bash
   remote-logger-server
   ```

2. Check the browser console for connection messages:

   ```
   [remote-logger-client] [MyApp] Connected.
   ```

3. Verify the port matches between client and server (default: 4455)

### Connection keeps retrying

If you see constant reconnection attempts, the server might not be running or is unreachable. The client will fall back to `console.log` in the meantime.

## License

MIT

## Related

- [remote-logger-server](https://github.com/khalidsheet/remote-logger-server) - The server component for this client

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

Happy Hacking!
