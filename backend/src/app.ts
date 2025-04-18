import express, { Request, Response } from 'express';
import cors from "cors";
import session from "express-session";
import bodyParser from 'body-parser';
import allRoutes from "./routes/index.js";
import { corsConfig, initDB, port, sessionConfig } from './config/index.js';
import { globalErrorHandler } from './middlewares/index.js';
import { isEnvDefined } from './common/type_check.js';
import morgan from 'morgan';

isEnvDefined();
initDB();

const app = express();

app.use(cors(corsConfig));

app.use(session(sessionConfig));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan("combined"));
app.use('/v1', allRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Trace!');
});

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server running at 0.0.0.0:${port}`);
});