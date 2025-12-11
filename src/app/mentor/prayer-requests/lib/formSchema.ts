import { FormData } from "./types";

export const gradeOptions = [
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "College Freshman",
  "College Sophomore",
  "College Junior",
  "College Senior",
];

export const categoryOptions = [
  "Academic",
  "Mentorship",
  "Career",
  "Relationship",
  "Wisdom",
  "Health",
  "Family",
  "Spiritual Growth",
];

export const priorityOptions = [
  { label: "Low - General support", value: "LOW" },
  { label: "Medium - Important guidance needed", value: "MEDIUM" },
  { label: "High - Urgent prayer needed", value: "HIGH" },
];

type FormField = {
  name: keyof FormData;
  label: string;
  type: "text" | "email" | "select" | "textarea";
  placeholder?: string;
  options?: string[] | { label: string; value: string }[];
  required?: boolean;
  row?: number;
};

// Define form schema
export const fields: FormField[] = [
  {
    name: "fullName",
    label: "Full Name *",
    type: "text",
    placeholder: "Your full name",
    required: true,
    row: 1,
  },
  {
    name: "email",
    label: "Email Address *",
    type: "email",
    placeholder: "your@email.com",
    required: true,
    row: 1,
  },

  {
    name: "studentId",
    label: "Student ID",
    type: "text",
    placeholder: "STU-2025-XXX",
    required: false,
    row: 2,
  },
  {
    name: "grade",
    label: "Grade Level *",
    type: "select",
    options: gradeOptions,
    required: true,
    row: 2,
  },

  {
    name: "school",
    label: "School/Institution *",
    type: "text",
    placeholder: "Your school name",
    required: true,
    row: 3,
  },
  {
    name: "subject",
    label: "Subject/Field of Study *",
    type: "text",
    placeholder: "e.g., Mathematics",
    required: true,
    row: 3,
  },

  {
    name: "prayerRequest",
    label: "Prayer Request *",
    type: "textarea",
    placeholder: "What would you like us to pray for?",
    required: true,
    row: 4,
  },

  {
    name: "priority",
    label: "Priority Level *",
    type: "select",
    options: priorityOptions,
    required: true,
    row: 5,
  },
  {
    name: "category",
    label: "Category *",
    type: "select",
    options: categoryOptions,
    required: true,
    row: 5,
  },

  {
    name: "additionalNotes",
    label: "Additional Notes",
    type: "textarea",
    placeholder: "Any additional information or context",
    required: false,
    row: 6,
  },
];
