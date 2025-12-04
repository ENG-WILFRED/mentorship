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

export const media = [
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", caption: "Leadership Summit at St. Mary's" },
  { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", caption: "Mentors at Hope Academy" },
  { url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", caption: "School Outreach" },
  { url: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80", caption: "Community Service" },
];

export const plans = [
  { date: "2025-10-10", school: "Grace Girls", topic: "Career Guidance", mentors: ["Pastor John"], goal: "Empower 380 girls for future careers." },
];
