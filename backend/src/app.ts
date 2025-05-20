import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import allRoutes from "./routes/index.js";
import { corsConfig, initDB, port } from './config/index.js';
import { globalErrorHandler } from './middlewares/index.js';
import { isEnvDefined } from './utils/index.js';
import morgan from 'morgan';

isEnvDefined();
initDB().then(r => console.log("DB is done initializing"));

const app = express();

app.use(cors(corsConfig));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use('/api/v1', allRoutes);
app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Trace!');
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
