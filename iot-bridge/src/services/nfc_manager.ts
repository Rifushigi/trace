import { EventEmitter } from 'events';
import { NFC } from 'nfc-pcsc';
import { logger } from '../utils/logger';
import { NFCCard } from '../types/iot';

export class NFCManager extends EventEmitter {
    private nfc: NFC;
    private knownCards: Map<string, NFCCard> = new Map();

    constructor() {
        super();
        this.nfc = new NFC();
        this.setupNFC();
    }

    private setupNFC() {
        this.nfc.on('reader', (reader) => {
            logger.info(`NFC reader connected: ${reader.reader.name}`);

            reader.on('card', (card) => {
                const nfcCard: NFCCard = {
                    id: card.uid,
                    uid: card.uid,
                    studentId: '', // To be associated with a student
                    lastUsed: new Date()
                };

                this.knownCards.set(card.uid, nfcCard);
                this.emit('cardDetected', nfcCard);
            });

            reader.on('error', (err) => {
                logger.error(`NFC reader error: ${err}`);
            });

            reader.on('end', () => {
                logger.info(`NFC reader disconnected: ${reader.reader.name}`);
            });
        });

        this.nfc.on('error', (err) => {
            logger.error(`NFC error: ${err}`);
        });
    }

    getKnownCards(): NFCCard[] {
        return Array.from(this.knownCards.values());
    }

    getCardByUid(uid: string): NFCCard | undefined {
        return this.knownCards.get(uid);
    }

    async startReading(): Promise<void> {
        // NFC reading starts automatically when the reader is connected
        logger.info('NFC reading started');
    }

    async stopReading(): Promise<void> {
        // NFC reading stops automatically when the reader is disconnected
        logger.info('NFC reading stopped');
    }

    associateCardWithStudent(uid: string, studentId: string): void {
        const card = this.knownCards.get(uid);
        if (card) {
            card.studentId = studentId;
            this.knownCards.set(uid, card);
            logger.info(`Associated NFC card ${uid} with student ${studentId}`);
        }
    }
} 