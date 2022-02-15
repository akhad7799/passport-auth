import passportLocal from "passport-local"
import passportGoogle from "passport-google-oauth20"
import {TelegramStrategy} from "passport-telegram-official"
import config from "./config";
import User, {IUser} from "../models/User"

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

export const strategy = (passport: any): any => {
    passport.use(new GoogleStrategy({
                clientID: config.ClientID,
                clientSecret: config.ClientSecret,
                callbackURL: '/api/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {

                const newUer: Object = {
                    firstName: profile.name.givenName ?? null,
                    lastName: profile.name.familyName ?? null,
                    googleID: profile.id
                }
                try {
                    let user = await User.findOne({googleID: profile.id})
                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUer)
                        done(null, user)
                    }
                } catch (e) {
                    console.log(e)
                }
            })
    );

    passport.use(new LocalStrategy(
        async function (username, password, done) {

            let user = await User.findOne({email: username});
            if (!user) return done(null, false)
            // @ts-ignore
            if (!(await user.correctPassword(password, user.password))) return done(null, false)
            else return done(null, user)

        }
    ));


    passport.use(new TelegramStrategy({
            botToken: config.BotToken,
        },
        async (profile, done) => {
            const newUser: Object = {
                firstName: profile.name.givenName ?? null,
                lastName: profile.name.familyName ?? null,
                telegramId: profile.id
            }
            try {
                let user = await User.findOne({telegramId: profile.id})
                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (e) {
                console.log(e)
            }

        }));

    passport.serializeUser<any, any>((user, done) => done(null, user.id));

    passport.deserializeUser<any, any>((id, done) => User.findById(id, (err: Error, user: IUser) => done(err, user)));

}

