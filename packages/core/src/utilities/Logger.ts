import { createLogger, transports, format } from 'winston';

export function createWinstonLogger(service: string) {
  return createLogger({
    level: 'info',
    defaultMeta: { service },
    format: format.combine(
      format.simple(),
      format.label({
        label: '[LOGGER]',
      }),
      format.colorize({ all: true }),
      format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
      format.align(),
      format.printf((info) => `[${info.level}] ${info.timestamp} : ${info.message}`)
    ),
    transports: [new transports.Console()],
  });
}