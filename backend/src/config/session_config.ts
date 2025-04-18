import MongoStore from "connect-mongo";
import { sessionSecret } from "./constants_config.js";
import { getDBUrl } from "./db_config.js";
import { SessionOptions } from "express-session";

export const sessionConfig: SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        secure: "auto",
        sameSite: "none",
        httpOnly: true
    },
    store: MongoStore.create({ mongoUrl: getDBUrl().url }),
}
