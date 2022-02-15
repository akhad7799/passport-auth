

import app from "./app"

import Database from "./core/db"
import config from "./config/config"
import { logger } from "./config/logger"

const init = async () => {
    try {
        const db = new Database()
        db.connect()

        app.listen(config.HttpPort, () => {
            logger.info(`INDEX:\tServer is running on port: ${config.HttpPort}`)
        })

        logger.info("INDEX:\tDatabase connection initialized.")
    } catch (e) {
        throw new Error(`DB connection error: ${e}`)
    }
}

init()