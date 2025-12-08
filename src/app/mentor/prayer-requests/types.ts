export type Status = "pending" | "in-progress" | "fulfilled";
export type Priority = "high" | "medium" | "low";
export type Tabs = 'dashboard' | 'requests' | 'analytics' |"settings"

export interface PrayerRequest {
  id: number; 
  request: string;
  school: string;
  priority: Priority;
  mentor: string;
  prayedBy: string[];
  notes: string;
  studentId: string;
  grade: string;
  subject: string;
  status: Status; 
  date: string;
  category: string;
  email: string;
  name: string;
}
