import winston from "winston"
import expressWinston from "express-winston"
import config from "./config"

const options = {
    format: winston.format.combine(
        winston.format.label({
            label: require("../../package.json").name
        }),
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.metadata({
            fillExcept: ["message", "level", "timestamp", "label"]
        }),
        winston.format.prettyPrint()
    )
}

const consoleLogFormat = winston.format.printf((info) => {
    return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
});

export const logger = winston.createLogger({
    ...options,
    transports: [
        new winston.transports.File({filename: "logs/debug.log", level: "debug"}),
        new winston.transports.File({filename: "logs/error.log", level: "error"})
    ]
});

export const expressLogger = () =>
    expressWinston.logger({
        ...options,
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), consoleLogFormat),
                level: "debug"
            }),
            new winston.transports.File({filename: "logs/requests.log", level: "debug"})
        ],
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "{{req.method}}:\t{{res.statusCode}} {{res.responseTime}}ms {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        colorize: true
    });

if (config.NodeEnv !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), consoleLogFormat),
            level: "debug"
        })
    )
}