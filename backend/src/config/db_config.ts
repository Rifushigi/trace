import { connect } from 'mongoose';
import { env, localDBUrl, prdDBUrl } from './constants_config.js';
import { DBConfig } from '../types/index.js';
import { DatabaseError } from '../middlewares/index.js';

export const getDBUrl = (): Pick<DBConfig, 'url'> => {
    if (env != 'production') {
        return { url: localDBUrl! };
    }

    return { url: prdDBUrl! };
}

export const initDB = async (): Promise<void> => {
    try {
        const { url } = getDBUrl();
        await connect(url!);
        console.log('Database connected')
    } catch (error: any) {
        throw new DatabaseError("Database initialization failed", { error });
    }
}