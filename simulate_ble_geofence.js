// Simulated classrooms in the database
const classrooms = [
    {
        _id: 'classroom-1',
        className: 'Physics 101',
        beaconIds: ['beacon-uuid-1', 'beacon-uuid-2', 'beacon-uuid-3', 'beacon-uuid-4']
    },
    {
        _id: 'classroom-2',
        className: 'Chemistry 201',
        beaconIds: ['beacon-uuid-5', 'beacon-uuid-6', 'beacon-uuid-7', 'beacon-uuid-8']
    },
    {
        _id: 'classroom-3',
        className: 'Mathematics 301',
        beaconIds: ['beacon-uuid-9', 'beacon-uuid-10', 'beacon-uuid-11', 'beacon-uuid-12']
    }
];

// Simulated beacon scan result (replace with real beacon IDs as needed)
const scannedBeaconIds = [
    'beacon-uuid-1',
    'beacon-uuid-2',
    'beacon-uuid-3',
    'beacon-uuid-4'
];

function detectClassroom(beaconIds) {
    let bestMatch = null;
    let maxDetected = 0;
    for (const classroom of classrooms) {
        const detected = classroom.beaconIds.filter(id => beaconIds.includes(id));
        if (detected.length > maxDetected && detected.length >= 3) { // threshold
            bestMatch = classroom;
            maxDetected = detected.length;
        }
    }
    if (bestMatch) {
        return { classroom: bestMatch, detectedCount: maxDetected };
    } else {
        return { error: 'No matching classroom found' };
    }
}

function generateRandomMatric() {
    const prefix = 'BU21CSC';
    const number = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return prefix + number;
}

const result = detectClassroom(scannedBeaconIds);
const matricId = generateRandomMatric();

console.log('response:', { ...result, id: matricId }); 