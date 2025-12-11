export type StatusOptions = "PENDING" | "IN_PROGRESS" | "FULFILLED";
export type PriorityOptions = "HIGH" | "MEDIUM" | "LOW";
export type TabsOptions = "dashboard" | "requests" | "analytics" | "settings";

export type GradeOption =
  | "9th Grade"
  | "10th Grade"
  | "11th Grade"
  | "12th Grade"
  | "College Freshman"
  | "College Sophomore"
  | "College Junior"
  | "College Senior";

export type CategoryOption =
  | "Academic"
  | "Mentorship"
  | "Career"
  | "Relationship"
  | "Wisdom"
  | "Health"
  | "Family"
  | "Spiritual Growth";

export interface PrayerRequest {
  id?: number;
  request: string;
  school?: string | null;
  priority?: PriorityOptions;
  mentor?: string | null;
  prayedBy?: string[];
  notes?: string | null;
  studentId?: string | null;
  grade?: string | null;
  subject?: string | null;
  status?: StatusOptions;
  date?: Date;
  category?: string | null;
  email?: string | null;
  name?: string | null;
}

export interface FormData {
  fullName: string;
  email: string;
  studentId: string;
  grade: GradeOption | "";
  school: string;
  subject: string;
  prayerRequest: string;
  priority: PriorityOptions | "";
  category: CategoryOption | "";
  additionalNotes: string;
}
