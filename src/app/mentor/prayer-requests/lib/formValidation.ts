 // formValidation.ts

import { FormData } from "./types";

  export const validators: Record<keyof FormData, (value: string) => string | null> = {
    fullName: (v) => (!v.trim() ? "Full Name is required" : null),
    email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : "Invalid email"),
    prayerRequest: (v) => (!v.trim() ? "Prayer request is required" : null),
    studentId: () => null,
    grade: () => null,
    school: () => null,
    subject: () => null,
    priority: () => null,
    category: () => null,
    additionalNotes: () => null,
  };