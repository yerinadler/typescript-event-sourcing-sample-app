import { createLogger, transports, format } from 'winston';

export function createWinstonLogger() {
  return createLogger({
    level: 'info',
    format: format.combine(
      format.simple(),
      format.label({
        label: '[LOGGER]',
      }),
      format.colorize({ all: true }),
      format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
      format.align(),
      format.printf((info) => `===== ${info.label} =====  ${info.timestamp}  ${info.level} : ${info.message}`)
    ),
    transports: [new transports.Console()],
  });
}