import { NextFunction, Request, Response } from "express"
import { logger } from "../config/logger"
import config from "../config/config"
import AppError from "../utils/appError"

class ErrorController {
    handleValidationErrorDB = (error: Error) => {
        const message = `${error.message}`
        return new AppError(400, message)
    }

    handleDuplicateKeyErrorDB = (error: Error) => {
        //@ts-ignore
        const message = `${Object.keys(error.keyValue)[0]} is already exist`
        return new AppError(400, message)
    }

    handleCastErrorDB = (error: Error) => {
        //@ts-ignore
        const message = `Invalid ${error.kind}`
        return new AppError(400, message)
    }

    sendErrorDev = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        console.log(err)
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

    sendErrorProd = (err: AppError, req: Request, res: Response, next: NextFunction) => {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message
            })
        }

        // B) Programming or other unknown error: don't leak error details
        logger.error("ERROR 💥", err)
        res.status(500).json({
            success: false,
            message: "Something went very wrong!"
        })
    }

    handle = (err: any, req: Request, res: Response, next: NextFunction) => {
        err.statusCode = err.statusCode || 500

        if (config.NodeEnv === "development") {
            this.sendErrorDev(err, req, res, next)
        } else if (config.NodeEnv === "production") {
            let error = err

            if (err.name === "ValidationError") error = this.handleValidationErrorDB(error)
            if (err.name === "CastError") error = this.handleCastErrorDB(error)
            if (err.code === 11000) error = this.handleDuplicateKeyErrorDB(error)

            this.sendErrorProd(error, req, res, next)
        }
    }
}

export default new ErrorController()