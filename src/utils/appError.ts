class AppError extends Error {
    constructor(statusCode: number, message: string) {
        super(message)

        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }

    statusCode = 500
    isOperational = true
}

export default AppError