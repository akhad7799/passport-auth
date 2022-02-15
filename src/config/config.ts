import dotenv from "dotenv"

dotenv.config()

interface Config {
    HttpPort: string
    MongoStr: string
    MongoDatabase: string
    MongoPassword: string
    MongoUser: string
    MongoAuthDisable: boolean
    NodeEnv: string
    JwtSecret: string
    JwtExpiresIn: string
    JwtRememberMe: string
    ClientID: string
    ClientSecret: string
    BotToken: string
}

let config: Config = {
    HttpPort: getConf("HTTP_PORT", "3000"),
    MongoStr: getConf("MONGO_STR", "localhost"),
    MongoDatabase: getConf("MONGO_DATABASE", "database"),
    MongoPassword: getConf("MONGO_PASSWORD", ""),
    MongoUser: getConf("MONGO_USER", ""),
    NodeEnv: getConf("NODE_ENV", "development"),
    JwtSecret: getConf("JWT_SECRET", "jwt-secret"),
    JwtExpiresIn: getConf("JWT_EXPIRES_IN", "1d"),
    JwtRememberMe: getConf("JWT_REMEMBER_ME", "15d"),
    MongoAuthDisable: false,
    ClientID: getConf("CLIENT_ID", "#your_gogle_client_id"),
    ClientSecret: getConf("CLIENT_SECRET", "#your_google_client_secret"),
    BotToken: getConf("BOT_TOKEN", "#your_bot_token")
}

function getConf(name: string, def: any): any {
    if (process.env[name]) {
        return process.env[name] || ""
    }

    return def
}

export default config