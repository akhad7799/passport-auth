import mongoose from "mongoose"
import { logger } from "../config/logger"
import config from "../config/config"

const db = mongoose.connection

db.on("error", () => {
    logger.error("DB:\tmongo db connection is not open")
    logger.info("DB:\tkilling myself so that container restarts")
})

db.once("open", () => {
    logger.info("DB:\tmongo db connection is established")
})

function getMongoDBUrl(auth: boolean): string {
    let url: string

    if (auth) {
        return `mongodb://localhost:27017/${config.MongoDatabase}`
    }

    url = config.MongoStr.replace("<USERNAME>", config.MongoUser)
        .replace("<PASSWORD>", config.MongoPassword)
        .replace("<DATABASE>", config.MongoDatabase)

    return url
}
export default class Database {
    url: string = getMongoDBUrl(false)

    constructor() {
        if (config.MongoAuthDisable) {
            this.url = getMongoDBUrl(config.MongoAuthDisable)
        }
    }

    connect() {
        return mongoose.connect(
            this.url,
            {
                autoIndex: false,
                serverSelectionTimeoutMS: 5000
            },
            (error) => {
                if (error) {
                    logger.error("DB:\tMongoDB Connection error:", error)
                    process.exit(1)
                }
            }
        )
    }
}