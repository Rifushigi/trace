import { Schedule } from '../../domain/entities/Schedule';

export const getMockSchedule = (): Schedule[] => {
    return [
        {
            id: '1',
            code: 'CSC101',
            course: 'Introduction to Computer Science',
            lecturer: {
                id: 'L001',
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@university.edu',
                office: 'Room 301, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=1',
                staffId: 'LEC001',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Monday',
                startTime: '09:00',
                endTime: '10:30',
                room: 'Room 101'
            },
            students: Array(45).fill(null).map((_, index) => ({
                id: `student-${index}`,
                firstName: `Student`,
                lastName: `${index}`,
                email: `student${index}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
                matricNo: `STU${index.toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '100',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 45,
                present: 38,
                absent: 5,
                late: 2
            },
            materials: [
                {
                    id: '1',
                    title: 'Course Syllabus',
                    type: 'syllabus',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/syllabus.pdf'
                },
                {
                    id: '2',
                    title: 'Week 1 Lecture Notes',
                    type: 'notes',
                    uploadDate: new Date('2024-01-16'),
                    url: 'https://example.com/lecture1.pdf'
                },
                {
                    id: '3',
                    title: 'Assignment 1',
                    type: 'assignment',
                    uploadDate: new Date('2024-01-20'),
                    url: 'https://example.com/assignment1.doc'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            code: 'CSC201',
            course: 'Data Structures and Algorithms',
            lecturer: {
                id: 'L002',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@university.edu',
                office: 'Room 302, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=2',
                staffId: 'LEC002',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Monday',
                startTime: '11:00',
                endTime: '12:30',
                room: 'Room 202'
            },
            students: Array(38).fill(null).map((_, index) => ({
                id: `student-${index + 45}`,
                firstName: `Student`,
                lastName: `${index + 45}`,
                email: `student${index + 45}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 55}`,
                matricNo: `STU${(index + 45).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '200',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 38,
                present: 30,
                absent: 5,
                late: 3
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '3',
            code: 'CSC301',
            course: 'Database Systems',
            lecturer: {
                id: 'L003',
                firstName: 'Michael',
                lastName: 'Johnson',
                email: 'michael.johnson@university.edu',
                office: 'Room 303, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=3',
                staffId: 'LEC003',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Monday',
                startTime: '14:00',
                endTime: '15:30',
                room: 'Room 303'
            },
            students: Array(42).fill(null).map((_, index) => ({
                id: `student-${index + 83}`,
                firstName: `Student`,
                lastName: `${index + 83}`,
                email: `student${index + 83}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 93}`,
                matricNo: `STU${(index + 83).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '300',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 42,
                present: 35,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '4',
            code: 'CSC401',
            course: 'Software Engineering',
            lecturer: {
                id: 'L004',
                firstName: 'Sarah',
                lastName: 'Williams',
                email: 'sarah.williams@university.edu',
                office: 'Room 304, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=4',
                staffId: 'LEC004',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Tuesday',
                startTime: '09:00',
                endTime: '10:30',
                room: 'Room 404'
            },
            students: Array(35).fill(null).map((_, index) => ({
                id: `student-${index + 121}`,
                firstName: `Student`,
                lastName: `${index + 121}`,
                email: `student${index + 121}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 131}`,
                matricNo: `STU${(index + 121).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '400',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 35,
                present: 28,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '5',
            code: 'CSC501',
            course: 'Computer Networks',
            lecturer: {
                id: 'L005',
                firstName: 'David',
                lastName: 'Brown',
                email: 'david.brown@university.edu',
                office: 'Room 305, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=5',
                staffId: 'LEC005',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Tuesday',
                startTime: '11:00',
                endTime: '12:30',
                room: 'Room 505'
            },
            students: Array(40).fill(null).map((_, index) => ({
                id: `student-${index + 156}`,
                firstName: `Student`,
                lastName: `${index + 156}`,
                email: `student${index + 156}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 166}`,
                matricNo: `STU${(index + 156).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '500',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 40,
                present: 32,
                absent: 5,
                late: 3
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '6',
            code: 'CSC601',
            course: 'Artificial Intelligence',
            lecturer: {
                id: 'L006',
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.davis@university.edu',
                office: 'Room 306, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=6',
                staffId: 'LEC006',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Tuesday',
                startTime: '14:00',
                endTime: '15:30',
                room: 'Room 606'
            },
            students: Array(45).fill(null).map((_, index) => ({
                id: `student-${index + 196}`,
                firstName: `Student`,
                lastName: `${index + 196}`,
                email: `student${index + 196}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 206}`,
                matricNo: `STU${(index + 196).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '600',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 45,
                present: 38,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '7',
            code: 'CSC701',
            course: 'Operating Systems',
            lecturer: {
                id: 'L007',
                firstName: 'Robert',
                lastName: 'Wilson',
                email: 'robert.wilson@university.edu',
                office: 'Room 307, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=7',
                staffId: 'LEC007',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Wednesday',
                startTime: '09:00',
                endTime: '10:30',
                room: 'Room 707'
            },
            students: Array(38).fill(null).map((_, index) => ({
                id: `student-${index + 241}`,
                firstName: `Student`,
                lastName: `${index + 241}`,
                email: `student${index + 241}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 251}`,
                matricNo: `STU${(index + 241).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '700',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 38,
                present: 30,
                absent: 5,
                late: 3
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '8',
            code: 'CSC801',
            course: 'Web Development',
            lecturer: {
                id: 'L008',
                firstName: 'Lisa',
                lastName: 'Anderson',
                email: 'lisa.anderson@university.edu',
                office: 'Room 308, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=8',
                staffId: 'LEC008',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Wednesday',
                startTime: '11:00',
                endTime: '12:30',
                room: 'Room 808'
            },
            students: Array(42).fill(null).map((_, index) => ({
                id: `student-${index + 279}`,
                firstName: `Student`,
                lastName: `${index + 279}`,
                email: `student${index + 279}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 289}`,
                matricNo: `STU${(index + 279).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '800',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 42,
                present: 35,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '9',
            code: 'CSC901',
            course: 'Mobile App Development',
            lecturer: {
                id: 'L009',
                firstName: 'Thomas',
                lastName: 'Clark',
                email: 'thomas.clark@university.edu',
                office: 'Room 309, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=9',
                staffId: 'LEC009',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Thursday',
                startTime: '09:00',
                endTime: '10:30',
                room: 'Room 909'
            },
            students: Array(40).fill(null).map((_, index) => ({
                id: `student-${index + 321}`,
                firstName: `Student`,
                lastName: `${index + 321}`,
                email: `student${index + 321}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 331}`,
                matricNo: `STU${(index + 321).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '900',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 40,
                present: 32,
                absent: 5,
                late: 3
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '10',
            code: 'CSC1001',
            course: 'Cloud Computing',
            lecturer: {
                id: 'L010',
                firstName: 'Rachel',
                lastName: 'Green',
                email: 'rachel.green@university.edu',
                office: 'Room 310, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=10',
                staffId: 'LEC010',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Thursday',
                startTime: '11:00',
                endTime: '12:30',
                room: 'Room 1010'
            },
            students: Array(35).fill(null).map((_, index) => ({
                id: `student-${index + 361}`,
                firstName: `Student`,
                lastName: `${index + 361}`,
                email: `student${index + 361}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 371}`,
                matricNo: `STU${(index + 361).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '1000',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 35,
                present: 28,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '11',
            code: 'CSC1101',
            course: 'Cybersecurity',
            lecturer: {
                id: 'L011',
                firstName: 'James',
                lastName: 'Wilson',
                email: 'james.wilson@university.edu',
                office: 'Room 311, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=11',
                staffId: 'LEC011',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Thursday',
                startTime: '14:00',
                endTime: '15:30',
                room: 'Room 1111'
            },
            students: Array(45).fill(null).map((_, index) => ({
                id: `student-${index + 396}`,
                firstName: `Student`,
                lastName: `${index + 396}`,
                email: `student${index + 396}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 406}`,
                matricNo: `STU${(index + 396).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '1100',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 45,
                present: 38,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '12',
            code: 'CSC1201',
            course: 'Machine Learning',
            lecturer: {
                id: 'L012',
                firstName: 'Emma',
                lastName: 'Taylor',
                email: 'emma.taylor@university.edu',
                office: 'Room 312, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=12',
                staffId: 'LEC012',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Friday',
                startTime: '09:00',
                endTime: '10:30',
                room: 'Room 1212'
            },
            students: Array(42).fill(null).map((_, index) => ({
                id: `student-${index + 441}`,
                firstName: `Student`,
                lastName: `${index + 441}`,
                email: `student${index + 441}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 451}`,
                matricNo: `STU${(index + 441).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '1200',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 42,
                present: 35,
                absent: 5,
                late: 2
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '13',
            code: 'CSC1301',
            course: 'Big Data Analytics',
            lecturer: {
                id: 'L013',
                firstName: 'Daniel',
                lastName: 'Lee',
                email: 'daniel.lee@university.edu',
                office: 'Room 313, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=13',
                staffId: 'LEC013',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Friday',
                startTime: '11:00',
                endTime: '12:30',
                room: 'Room 1313'
            },
            students: Array(38).fill(null).map((_, index) => ({
                id: `student-${index + 483}`,
                firstName: `Student`,
                lastName: `${index + 483}`,
                email: `student${index + 483}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 493}`,
                matricNo: `STU${(index + 483).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '1300',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 38,
                present: 30,
                absent: 5,
                late: 3
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '14',
            code: 'CSC1401',
            course: 'Blockchain Technology',
            lecturer: {
                id: 'L014',
                firstName: 'Sophia',
                lastName: 'Martinez',
                email: 'sophia.martinez@university.edu',
                office: 'Room 314, Computer Science Building',
                role: 'lecturer',
                avatar: 'https://i.pravatar.cc/150?img=14',
                staffId: 'LEC014',
                college: 'College of Engineering',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: {
                day: 'Friday',
                startTime: '14:00',
                endTime: '15:30',
                room: 'Room 1414'
            },
            students: Array(40).fill(null).map((_, index) => ({
                id: `student-${index + 521}`,
                firstName: `Student`,
                lastName: `${index + 521}`,
                email: `student${index + 521}@example.com`,
                role: 'student',
                avatar: `https://i.pravatar.cc/150?img=${index + 531}`,
                matricNo: `STU${(index + 521).toString().padStart(3, '0')}`,
                program: 'Computer Science',
                level: '1400',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            })),
            status: 'upcoming',
            attendance: {
                total: 40,
                present: 32,
                absent: 5,
                late: 3
            },
            materials: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
}; 