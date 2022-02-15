import express, {Request, Response} from "express"
import passport from "passport";
import session from "express-session";
import {createClient} from 'redis';
import connectRedis from 'connect-redis'
import bodyParser from "body-parser";
import * as path from "path";

import routes from "./routes/index"
import {expressLogger} from "./config/logger"
import {strategy} from "./config/passport";
import errorController from "./controllers/error"
import AppError from "./utils/appError"
import AuthMiddleware from './middlewares/auth'

strategy(passport);

const app = express()

//redis to save sessions
const RedisStore = connectRedis(session);
const redisClient = createClient({legacyMode: true});
redisClient.connect().catch(console.error)

// middlewares
app.use(expressLogger())

app.use(bodyParser.urlencoded({extended: false}));


app.use(session({
    store: new RedisStore({
        // @ts-ignore
        client: redisClient,
        host: 'localhost',
        port: 6379,
        ttl: 60,
    }),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)


//routes to check
app.get("/", (req: Request, res: Response) => {
    res.json({
        success: "Cool"
    })
})
app.get("/dashboard", (req: Request, res: Response) => {
    res.json({
        success: "Redirected!"
    })
})

//route to check telegram widget
app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});


// 404 Error
app.all("*", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`))
})

app.use(errorController.handle)

// @ts-ignore
export default app