import fs from 'fs';
import path from 'path';

const logDir = path.join('logs');
const logFile = path.join(logDir, 'app.json');

type LogLevel = 'info' | 'warn' | 'error';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const stream = fs.createWriteStream(logFile, { flags: 'a' });

export function logger(level: LogLevel, message: string, meta = {}) {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
  stream.write(line + '\n');
}
