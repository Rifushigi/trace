import { EventEmitter } from 'events';
import { getDistance, isPointWithinRadius } from 'geolib';
import { logger } from '../utils/logger';
import { config } from '../config';

interface Location {
    latitude: number;
    longitude: number;
}

interface Geofence {
    id: string;
    name: string;
    center: Location;
    radius: number; // in meters
    active: boolean;
}

export class GeofenceManager extends EventEmitter {
    private geofences: Map<string, Geofence> = new Map();
    private locationUpdateInterval: NodeJS.Timeout | null = null;

    constructor() {
        super();
    }

    async setGeofence(data: { id: string; name: string; center: Location; radius: number }): Promise<Geofence> {
        const geofence: Geofence = {
            ...data,
            active: true
        };

        this.geofences.set(data.id, geofence);
        logger.info(`Geofence set: ${data.name}`);

        return geofence;
    }

    async removeGeofence(id: string): Promise<void> {
        if (this.geofences.has(id)) {
            this.geofences.delete(id);
            logger.info(`Geofence removed: ${id}`);
        }
    }

    async updateGeofenceStatus(id: string, active: boolean): Promise<Geofence | undefined> {
        const geofence = this.geofences.get(id);
        if (geofence) {
            geofence.active = active;
            this.geofences.set(id, geofence);
            logger.info(`Geofence ${id} status updated to ${active}`);
            return geofence;
        }
        return undefined;
    }

    startLocationTracking(interval: number = 5000): void {
        if (this.locationUpdateInterval) {
            return;
        }

        this.locationUpdateInterval = setInterval(() => {
            // In a real implementation, this would get the actual device location
            // For now, we'll simulate location updates
            this.simulateLocationUpdate();
        }, interval);

        logger.info('Location tracking started');
    }

    stopLocationTracking(): void {
        if (this.locationUpdateInterval) {
            clearInterval(this.locationUpdateInterval);
            this.locationUpdateInterval = null;
            logger.info('Location tracking stopped');
        }
    }

    private simulateLocationUpdate(): void {
        // Simulate a location update
        const location: Location = {
            latitude: 0.0, // Replace with actual device location
            longitude: 0.0
        };

        this.emit('locationUpdate', location);

        // Check if location is within any geofence
        for (const [id, geofence] of this.geofences) {
            if (!geofence.active) continue;

            const isWithin = isPointWithinRadius(
                location,
                geofence.center,
                geofence.radius
            );

            if (isWithin) {
                this.emit('geofenceEntered', { geofenceId: id, location });
            } else {
                const distance = getDistance(location, geofence.center);
                if (distance <= geofence.radius * 1.1) { // 10% buffer
                    this.emit('geofenceExited', { geofenceId: id, location });
                }
            }
        }
    }

    isLocationWithinGeofence(location: Location, geofenceId: string): boolean {
        const geofence = this.geofences.get(geofenceId);
        if (!geofence || !geofence.active) {
            return false;
        }

        return isPointWithinRadius(
            location,
            geofence.center,
            geofence.radius
        );
    }

    getGeofenceById(id: string): Geofence | undefined {
        return this.geofences.get(id);
    }

    getAllGeofences(): Geofence[] {
        return Array.from(this.geofences.values());
    }

    getActiveGeofences(): Geofence[] {
        return Array.from(this.geofences.values()).filter(g => g.active);
    }
} 