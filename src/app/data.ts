

export const topicsList = [
  "Leadership",
  "Faith & Values",
  "Career Guidance",
  "Relationships",
  "Community Service",
];

export const studentsList = ["0–50", "51–100", "101–200", "200+"];
// Centralized data for mentorship dashboard and mission creation

export const mentorsList = [
  "Pastor John",
  "Mentor Grace",
  "Pastor Mary",
  "Pastor David",
  "Mentor Faith",
];

export const schoolsList = [
  "St. Mary's High",
  "Hope Academy",
  "Faith School",
  "Grace Girls",
  "Light Academy",
];

export const mentors = [
  { name: "Pastor John", role: "Lead Mentor", phone: "+254712345678", missions: 12, img: "/mentor.jpeg" },
  { name: "Mentor Grace", role: "Prayer Mentor", phone: "+254798765432", missions: 8, img: "/mentor.jpeg" },
  { name: "Pastor Mary", role: "Community Mentor", phone: "+254701234567", missions: 10, img: "/mentor.jpeg" },
];

export const schools = [
  { name: "St. Mary's High", location: "Nairobi", students: 450, contact: "Mr. Otieno", logo: "" },
  { name: "Hope Academy", location: "Kiambu", students: 320, contact: "Ms. Wanjiku", logo: "" },
  { name: "Faith School", location: "Machakos", students: 210, contact: "Mr. Mwangi", logo: "" },
  { name: "Grace Girls", location: "Nakuru", students: 380, contact: "Mrs. Njeri", logo: "" },
];

export const missions = [
  {
    title: "Leadership Summit",
    date: "2025-09-15",
    schools: ["St. Mary's High"],
    topic: "Leadership",
    mentors: ["Pastor John"],
    status: "Completed",
    students: 200,
    description: "Empowering students with leadership skills and values.",
    goals: "Identify and train new student leaders.",
    outcomes: "5 new leaders identified, increased engagement.",
    notes: "Excellent participation from all students."
  },
  {
    title: "Faith & Prayer Retreat",
    date: "2025-09-22",
    schools: ["Hope Academy", "Faith School"],
    topic: "Faith",
    mentors: ["Mentor Grace", "Pastor Mary"],
    status: "Completed",
    students: 300,
    description: "A retreat focused on deepening faith and prayer.",
    goals: "Improve prayer participation and spiritual growth.",
    outcomes: "Improved prayer participation, stronger community bonds.",
    notes: "Students requested more frequent retreats."
  },
  {
    title: "Career Guidance Fair",
    date: "2025-10-10",
    schools: ["Grace Girls"],
    topic: "Career Guidance",
    mentors: ["Pastor John"],
    status: "Upcoming",
    students: 380,
    description: "Guiding students towards future careers and opportunities.",
    goals: "Empower girls for future careers.",
    outcomes: "Expected to increase career awareness.",
    notes: "Special guests from local businesses invited."
  },
];

export const programs = ["Leadership", "Faith", "Career Guidance", "Service", "Prayer"];

export const reports = [
  { school: "St. Mary's High", date: "2025-09-15", topic: "Leadership", students: 200, outcome: "Great engagement, 5 new leaders identified." },
  { school: "Hope Academy", date: "2025-09-22", topic: "Faith", students: 150, outcome: "Improved prayer participation." },
];



export const plans = [
  { date: "2025-10-10", school: "Grace Girls", topic: "Career Guidance", mentors: ["Pastor John"], goal: "Empower 380 girls for future careers." },
];
// In your data.ts file
export type MediaType = 'image' | 'video' | 'document';
export type MediaCategory = 'all' | 'missions' | 'sermons' | 'events' | 'students';

export interface MediaItem {
  id: string;
  url: string;
  thumbnail?: string;
  caption: string;
  type: MediaType;
  category: MediaCategory;
  date: string;
  location?: string;
  uploader: string;
  likes: number;
  views: number;
  tags: string[];
  description?: string;
}

// Your actual media data
export const media: MediaItem[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300',
    caption: 'School Outreach Mission',
    type: 'image',
    category: 'missions',
    date: '2024-01-15',
    location: 'Nairobi High School',
    uploader: 'John Doe',
    likes: 45,
    views: 230,
    tags: ['mission', 'school', 'students', 'outreach'],
    description: 'Annual mission outreach at Nairobi High School with over 200 students'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300',
    caption: 'Leadership Training Workshop',
    type: 'image',
    category: 'missions',
    date: '2024-01-10',
    location: 'St. Mary\'s Academy',
    uploader: 'Sarah Mentor',
    likes: 32,
    views: 180,
    tags: ['workshop', 'leadership', 'training'],
    description: 'Leadership skills development for student representatives'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300',
    caption: 'Sunday Youth Service',
    type: 'video',
    category: 'sermons',
    date: '2024-01-14',
    location: 'Main Church Hall',
    uploader: 'Pastor James',
    likes: 89,
    views: 450,
    tags: ['sermon', 'youth', 'worship', 'service'],
    description: 'Recording of Sunday youth service with powerful message'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659',
    thumbnail: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300',
    caption: 'Bible Study Session',
    type: 'image',
    category: 'missions',
    date: '2024-01-05',
    location: 'Community Center',
    uploader: 'David Leader',
    likes: 67,
    views: 320,
    tags: ['bible', 'study', 'discussion', 'faith'],
    description: 'Weekly bible study with mentoring group'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300',
    caption: 'Career Guidance Seminar',
    type: 'image',
    category: 'events',
    date: '2024-01-08',
    location: 'Tech Institute',
    uploader: 'Career Counselor',
    likes: 54,
    views: 210,
    tags: ['career', 'seminar', 'guidance', 'future'],
    description: 'Career guidance and mentorship program'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    caption: 'Student Testimonies',
    type: 'video',
    category: 'students',
    date: '2024-01-12',
    location: 'Youth Center',
    uploader: 'Student Ministry',
    likes: 78,
    views: 380,
    tags: ['testimony', 'students', 'sharing', 'impact'],
    description: 'Students sharing their experiences from the mentorship program'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
    thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300',
    caption: 'Community Service Day',
    type: 'image',
    category: 'missions',
    date: '2024-01-03',
    location: 'Local Community',
    uploader: 'Community Lead',
    likes: 91,
    views: 420,
    tags: ['community', 'service', 'outreach', 'helping'],
    description: 'Students participating in community service activities'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8f5be',
    thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8f5be?w=300',
    caption: 'Prayer and Worship Night',
    type: 'video',
    category: 'sermons',
    date: '2024-01-07',
    location: 'Church Auditorium',
    uploader: 'Worship Team',
    likes: 112,
    views: 560,
    tags: ['prayer', 'worship', 'night', 'spiritual'],
    description: 'Special prayer and worship night for students'
  },
];

