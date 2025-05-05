import bcrypt from 'bcrypt';

export function comparePayload(plainPayload: string, hashedPayload: string): Promise<boolean> {
    return bcrypt.compare(plainPayload, hashedPayload);
}

export async function hashPayload(payload: string): Promise<string> {
    return await bcrypt.hash(payload, 10);
}