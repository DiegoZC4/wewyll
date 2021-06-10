const winston = require('winston');
const format = winston.format;

// TODO: strip authorization keys out of logs
const logger = winston.createLogger({
  level: 'debug',
  // format: format.json(),
  defaultMeta: {service: 'wewyll-api'},
  transports: [
    new winston.transports.File({
      filename: 'logs/api.log',
      format: format.combine(format.uncolorize(), format.json())
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(format.uncolorize(), format.json())
    }),
  ],
});

const alignedWithColorsAndTime = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}:${info.message}`)
);

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: alignedWithColorsAndTime,
    level: 'debug'
  }));
}

module.exports = logger;
