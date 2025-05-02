import dotenv from 'dotenv';

dotenv.config();

export const config = {
    DEFAULT_CLASS_ID: process.env.DEFAULT_CLASS_ID || 'default',
    BLE_SCAN_INTERVAL: parseInt(process.env.BLE_SCAN_INTERVAL || '5000', 10),
    NFC_POLL_INTERVAL: parseInt(process.env.NFC_POLL_INTERVAL || '1000', 10),
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    SERVER_PORT: parseInt(process.env.SERVER_PORT || '3001', 10),
    SERVER_HOST: process.env.SERVER_HOST || 'localhost',
    corsOrigin: process.env.CORS_ORIGIN || '*'
}; 