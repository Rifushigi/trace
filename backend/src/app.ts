import express, { Request, Response } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import allRoutes from "./routes/index.js";
import { corsConfig, initDB, port } from './config/index.js';
import { globalErrorHandler } from './middlewares/index.js';
import { isEnvDefined } from './utils/index.js';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createDefaultAdmin } from './services/user_service.js';

config();

isEnvDefined();

const app = express();

// Middleware
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/v1', allRoutes);

// Error handling
app.use(globalErrorHandler);

// Connect to database and start server
initDB()
    .then(async () => {
        // Create default admin user
        await createDefaultAdmin();

        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error: Error) => {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    });

export default app;
