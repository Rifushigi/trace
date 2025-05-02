import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import WebSocket from 'ws';

export class VideoStreamManager extends EventEmitter {
    private streams: Map<string, WebSocket> = new Map();
    private mlServiceUrl: string;

    constructor(mlServiceUrl: string) {
        super();
        this.mlServiceUrl = mlServiceUrl;
    }

    async addStream(streamId: string, location: string, sessionId: string): Promise<void> {
        try {
            const ws = new WebSocket(`${this.mlServiceUrl}/ws/video-stream`);

            ws.on('open', () => {
                // Send stream metadata
                ws.send(JSON.stringify({
                    stream_id: streamId,
                    location,
                    session_id: sessionId
                }));
            });

            ws.on('message', (data: string) => {
                const result = JSON.parse(data);
                this.emit('faceDetected', {
                    streamId,
                    ...result.data
                });
            });

            ws.on('error', (error: Error) => {
                logger.error(`WebSocket error for stream ${streamId}:`, error);
            });

            ws.on('close', () => {
                this.streams.delete(streamId);
                logger.info(`Stream ${streamId} closed`);
            });

            this.streams.set(streamId, ws);
            logger.info(`Added video stream: ${streamId} at ${location}`);
        } catch (error) {
            logger.error(`Failed to add stream ${streamId}:`, error);
            throw error;
        }
    }

    async removeStream(streamId: string): Promise<void> {
        const ws = this.streams.get(streamId);
        if (ws) {
            ws.close();
            this.streams.delete(streamId);
            logger.info(`Removed video stream: ${streamId}`);
        }
    }

    async sendFrame(streamId: string, frame: Buffer): Promise<void> {
        const ws = this.streams.get(streamId);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(frame);
        }
    }

    getStreamStatus(streamId: string): boolean {
        const ws = this.streams.get(streamId);
        return ws ? ws.readyState === WebSocket.OPEN : false;
    }
} 