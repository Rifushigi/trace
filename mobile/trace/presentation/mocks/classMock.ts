import { Schedule } from '../../domain/entities/Schedule';

export interface ClassDetails extends Omit<Schedule, 'schedule'> {
    description: string;
    objectives: string[];
    prerequisites: string[];
    grading: {
        assignments: number;
        midterm: number;
        final: number;
        participation: number;
    };
    announcements: {
        id: string;
        title: string;
        content: string;
        date: string;
    }[];
    course: string;
}

export const getMockClasses = (): ClassDetails[] => {
    return [
        {
            id: '1',
            code: 'CSC101',
            course: 'Introduction to Computer Science',
            description: 'An introductory course covering fundamental concepts of computer science, programming, and problem-solving techniques.',
            objectives: [
                'Understand basic programming concepts and algorithms',
                'Develop problem-solving skills using computational thinking',
                'Learn fundamental data structures and their applications',
                'Gain hands-on experience with programming languages'
            ],
            prerequisites: [
                'Basic mathematics',
                'No prior programming experience required'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            announcements: [
                {
                    id: '1',
                    title: 'Welcome to CSC101!',
                    content: 'Welcome to Introduction to Computer Science. Please review the course syllabus and join our class Discord server.',
                    date: '2024-01-15'
                },
                {
                    id: '2',
                    title: 'First Assignment Posted',
                    content: 'The first programming assignment has been posted. Due date is next Monday.',
                    date: '2024-01-20'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            code: 'CSC201',
            course: 'Data Structures and Algorithms',
            description: 'A comprehensive study of fundamental data structures and algorithms, focusing on their implementation and analysis.',
            objectives: [
                'Master common data structures (arrays, linked lists, trees, graphs)',
                'Implement and analyze sorting and searching algorithms',
                'Develop efficient problem-solving strategies',
                'Understand time and space complexity analysis'
            ],
            prerequisites: [
                'CSC101 or equivalent programming experience',
                'Basic understanding of mathematics and logic'
            ],
            grading: {
                assignments: 35,
                midterm: 20,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Course Syllabus',
                    type: 'syllabus',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/dsa-syllabus.pdf'
                },
                {
                    id: '2',
                    title: 'Data Structures Overview',
                    type: 'notes',
                    uploadDate: new Date('2024-01-16'),
                    url: 'https://example.com/dsa-overview.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Welcome to Data Structures',
                    content: 'Welcome to CSC201. Please ensure you have completed the prerequisite course or have equivalent experience.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '3',
            code: 'CSC301',
            course: 'Database Systems',
            description: 'An in-depth exploration of database design, implementation, and management, covering both theoretical concepts and practical applications.',
            objectives: [
                'Understand database design principles and normalization',
                'Master SQL for data manipulation and querying',
                'Learn database management system architecture',
                'Implement database applications using modern technologies'
            ],
            prerequisites: [
                'CSC201 or equivalent',
                'Basic understanding of data structures'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Database Design Principles',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/db-design.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Database Project Kickoff',
                    content: 'The semester project will involve designing and implementing a complete database system. Details to follow.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '4',
            code: 'CSC401',
            course: 'Software Engineering',
            description: 'A comprehensive study of software development methodologies, tools, and best practices for building large-scale applications.',
            objectives: [
                'Master software development lifecycle methodologies',
                'Learn design patterns and architectural principles',
                'Practice agile development and project management',
                'Implement quality assurance and testing strategies'
            ],
            prerequisites: [
                'CSC301 or equivalent',
                'Experience with multiple programming languages'
            ],
            grading: {
                assignments: 25,
                midterm: 20,
                final: 30,
                participation: 10,
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Software Development Lifecycle',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/sdlc.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Team Formation',
                    content: 'Please form teams of 4-5 students for the semester project by next week.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '5',
            code: 'CSC501',
            course: 'Computer Networks',
            description: 'A detailed study of computer network architectures, protocols, and technologies, from local area networks to the Internet.',
            objectives: [
                'Understand network protocols and architectures',
                'Master network security principles',
                'Learn network programming and socket APIs',
                'Implement network applications and services'
            ],
            prerequisites: [
                'CSC401 or equivalent',
                'Basic understanding of operating systems'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Network Protocols',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/protocols.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Network Lab Setup',
                    content: 'Please install the required network simulation software before the next lab session.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '6',
            code: 'CSC601',
            course: 'Artificial Intelligence',
            description: 'An exploration of artificial intelligence concepts, algorithms, and applications, from machine learning to natural language processing.',
            objectives: [
                'Understand fundamental AI concepts and algorithms',
                'Master machine learning techniques',
                'Implement AI solutions for real-world problems',
                'Explore ethical considerations in AI development'
            ],
            prerequisites: [
                'CSC501 or equivalent',
                'Strong background in mathematics and statistics'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Introduction to AI',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/ai-intro.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'AI Project Selection',
                    content: 'Choose your AI project topic from the provided list by next week.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '7',
            code: 'CSC701',
            course: 'Operating Systems',
            description: 'A comprehensive study of operating system concepts, including process management, memory management, and file systems.',
            objectives: [
                'Understand operating system architecture and components',
                'Master process and thread management',
                'Learn memory management and virtual memory',
                'Implement basic operating system features'
            ],
            prerequisites: [
                'CSC601 or equivalent',
                'Strong programming skills'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'OS Architecture',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/os-arch.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Kernel Programming',
                    content: 'Next week we will begin kernel programming exercises. Please prepare your development environment.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '8',
            code: 'CSC801',
            course: 'Web Development',
            description: 'A modern approach to web development, covering both frontend and backend technologies, frameworks, and best practices.',
            objectives: [
                'Master modern web development frameworks',
                'Learn full-stack development techniques',
                'Implement responsive and accessible web applications',
                'Understand web security and performance optimization'
            ],
            prerequisites: [
                'CSC701 or equivalent',
                'Basic understanding of HTML, CSS, and JavaScript'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Modern Web Development',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/web-dev.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Framework Selection',
                    content: 'Choose your preferred frontend and backend frameworks for the semester project.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '9',
            code: 'CSC901',
            course: 'Mobile App Development',
            description: 'A comprehensive course on mobile application development, covering both iOS and Android platforms.',
            objectives: [
                'Master mobile app development frameworks',
                'Learn platform-specific development techniques',
                'Implement responsive and native mobile applications',
                'Understand mobile app security and performance'
            ],
            prerequisites: [
                'CSC801 or equivalent',
                'Experience with JavaScript and web development'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Mobile Development Basics',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/mobile-dev.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Development Environment',
                    content: 'Set up your development environment for both iOS and Android development.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '10',
            code: 'CSC1001',
            course: 'Cloud Computing',
            description: 'An in-depth study of cloud computing technologies, architectures, and services, focusing on practical implementation.',
            objectives: [
                'Understand cloud computing concepts and architectures',
                'Master cloud service models and deployment',
                'Learn cloud security and scalability',
                'Implement cloud-based applications and services'
            ],
            prerequisites: [
                'CSC901 or equivalent',
                'Understanding of distributed systems'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Cloud Architecture',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/cloud-arch.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Cloud Platform Access',
                    content: 'You will receive access credentials for AWS and Azure platforms next week.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '11',
            code: 'CSC1101',
            course: 'Cybersecurity',
            description: 'A comprehensive study of cybersecurity principles, threats, and defense mechanisms.',
            objectives: [
                'Understand security threats and vulnerabilities',
                'Master security protocols and encryption',
                'Learn ethical hacking and penetration testing',
                'Implement security measures and best practices'
            ],
            prerequisites: [
                'CSC1001 or equivalent',
                'Understanding of networking and operating systems'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Security Fundamentals',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/security-fund.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Security Lab Setup',
                    content: 'Install the required security tools and virtual machines for the lab sessions.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '12',
            code: 'CSC1201',
            course: 'Machine Learning',
            description: 'An advanced course on machine learning algorithms, techniques, and applications.',
            objectives: [
                'Master machine learning algorithms and models',
                'Learn data preprocessing and feature engineering',
                'Implement and evaluate ML models',
                'Understand deep learning and neural networks'
            ],
            prerequisites: [
                'CSC1101 or equivalent',
                'Strong background in mathematics and statistics'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'ML Algorithms',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/ml-algo.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Dataset Selection',
                    content: 'Choose your dataset for the semester project from the provided list.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '13',
            code: 'CSC1301',
            course: 'Big Data Analytics',
            description: 'A comprehensive study of big data technologies, tools, and analytical techniques.',
            objectives: [
                'Master big data processing frameworks',
                'Learn data warehousing and ETL processes',
                'Implement data analytics and visualization',
                'Understand distributed computing concepts'
            ],
            prerequisites: [
                'CSC1201 or equivalent',
                'Understanding of database systems'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Big Data Processing',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/big-data.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Hadoop Setup',
                    content: 'Set up your Hadoop development environment for the upcoming lab sessions.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '14',
            code: 'CSC1401',
            course: 'Blockchain Technology',
            description: 'An in-depth exploration of blockchain technology, cryptocurrencies, and decentralized applications.',
            objectives: [
                'Understand blockchain architecture and consensus mechanisms',
                'Master smart contract development',
                'Learn cryptocurrency concepts and implementation',
                'Build decentralized applications'
            ],
            prerequisites: [
                'CSC1301 or equivalent',
                'Understanding of cryptography'
            ],
            grading: {
                assignments: 30,
                midterm: 25,
                final: 35,
                participation: 10
            },
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
            materials: [
                {
                    id: '1',
                    title: 'Blockchain Basics',
                    type: 'notes',
                    uploadDate: new Date('2024-01-15'),
                    url: 'https://example.com/blockchain.pdf'
                }
            ],
            announcements: [
                {
                    id: '1',
                    title: 'Smart Contract Development',
                    content: 'Next week we will begin smart contract development using Solidity.',
                    date: '2024-01-15'
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
}; 