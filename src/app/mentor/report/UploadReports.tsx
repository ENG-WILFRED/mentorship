'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

interface Mission {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
}

const UploadReports: React.FC = () => {
    const router = useRouter();
    const toast = useToast();
    const [reportTitle, setReportTitle] = useState('');
    const [reportType, setReportType] = useState<'session_summary' | 'progress_report' | 'feedback' | 'other' | ''>('');
    const [missionId, setMissionId] = useState<string>('');
    const [schoolId, setSchoolId] = useState<string>('');
    const [reportDate, setReportDate] = useState('');
    const [students, setStudents] = useState('');
    const [content, setContent] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [missions, setMissions] = useState<Mission[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Fetch missions and schools on component mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [missionsRes, schoolsRes] = await Promise.all([
            fetch('/api/missions'),
            fetch('/api/schools'),
          ]);

          if (missionsRes.ok) {
            const missionsData = await missionsRes.json();
            setMissions(missionsData);
          }
          if (schoolsRes.ok) {
            const schoolsData = await schoolsRes.json();
            setSchools(schoolsData);
          }
        } catch (error) {
          console.error('Failed to fetch missions and schools:', error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionStatus('submitting');
        setErrorMessage('');
        
        // Basic validation for report fields
        if (!missionId || !schoolId || !reportDate || !reportTitle || !content) {
            setErrorMessage('Please fill in all required fields for the report.');
            setSubmissionStatus('error');
            toast('Please fill in all required fields', 'error');
            return;
        }

        try {
            const response = await fetch('/api/reports', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                missionId,
                schoolId,
                date: reportDate,
                topic: reportTitle,
                students: students || 0,
                outcome: content,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to create report');
            }

            setSubmissionStatus('success');
            toast('Report uploaded successfully!', 'success');
            
            // Clear form fields after successful submission
            setReportTitle('');
            setReportType('');
            setMissionId('');
            setSchoolId('');
            setReportDate('');
            setStudents('');
            setContent('');

            // Redirect after brief delay
            setTimeout(() => {
              router.push('/mentor/report');
            }, 1500);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                toast(error.message, 'error');
            } else {
                setErrorMessage('An unexpected error occurred.');
                toast('An unexpected error occurred', 'error');
            }
            setSubmissionStatus('error');
        }
    };
    
    // Reset status messages after a short delay for better UX
    React.useEffect(() => {
        if (submissionStatus === 'success' || submissionStatus === 'error') {
            const timer = setTimeout(() => {
                setSubmissionStatus('idle');
                setErrorMessage('');
            }, 3000); // Clear message after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [submissionStatus]);

    return (
        <div style={styles.container}>
            {/* Style tag to target placeholder pseudo-element */}
            <style>
                {`
                    ::placeholder {
                        color: #a855f7; /* purple-500 */
                        opacity: 0.7;
                    }
                `}
            </style>

            <h2 style={styles.title}>Add New Report</h2>
            <p style={styles.subtitle}>Create and submit a mentorship report from the database.</p>

            {loadingData ? (
              <p style={styles.loadingMessage}>Loading missions and schools...</p>
            ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="reportTitle" style={styles.label}>Report Title:</label>
                    <input
                        type="text"
                        id="reportTitle"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        style={styles.input}
                        required
                        placeholder="e.g., Weekly Session Summary"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="missionId" style={styles.label}>Mission:</label>
                    <select
                        id="missionId"
                        value={missionId}
                        onChange={(e) => setMissionId(e.target.value)}
                        style={styles.select}
                        required
                    >
                        <option value="">Select a Mission</option>
                        {missions.map((mission) => (
                          <option key={mission.id} value={mission.id}>
                            {mission.name}
                          </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="schoolId" style={styles.label}>School:</label>
                    <select
                        id="schoolId"
                        value={schoolId}
                        onChange={(e) => setSchoolId(e.target.value)}
                        style={styles.select}
                        required
                    >
                        <option value="">Select a School</option>
                        {schools.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.name}
                          </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="reportDate" style={styles.label}>Report Date:</label>
                    <input
                        type="date"
                        id="reportDate"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="students" style={styles.label}>Number of Students:</label>
                    <input
                        type="number"
                        id="students"
                        value={students}
                        onChange={(e) => setStudents(e.target.value)}
                        style={styles.input}
                        placeholder="e.g., 25"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="content" style={styles.label}>Report Outcome:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={styles.textarea}
                        rows={6}
                        required
                        placeholder="Enter detailed notes, progress, feedback, etc."
                    />
                </div>

                {submissionStatus === 'error' && errorMessage && (
                    <p style={styles.errorMessage}>{errorMessage}</p>
                )}

                {submissionStatus === 'success' && (
                    <p style={styles.successMessage}>Report added successfully!</p>
                )}

                <div style={styles.buttonContainer}>
                    <button
                        type="submit"
                        disabled={submissionStatus === 'submitting'}
                        style={submissionStatus === 'submitting' ? styles.buttonDisabled : styles.button}
                    >
                        {submissionStatus === 'submitting' ? 'Submitting Report...' : 'Submit Report'}
                    </button>
                </div>
            </form>
            )}
        </div>
    );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    container: { backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid #e9d5ff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', maxWidth: '600px', margin: '2rem auto' },
    title: { marginTop: 0, fontSize: '1.5rem', color: '#6b21a8' }, // purple-800
    subtitle: { marginTop: '-0.5rem', marginBottom: '2rem', color: '#7e22ce' }, // purple-700
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    label: { marginBottom: '0.5rem', fontWeight: 600, color: '#6b21a8' }, // purple-800
    input: { padding: '0.75rem', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.5)' },
    select: { padding: '0.75rem', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' },
    textarea: { padding: '0.75rem', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '1rem', resize: 'vertical', backgroundColor: 'rgba(255, 255, 255, 0.5)' },
    buttonContainer: { textAlign: 'right', marginTop: '1.5rem' },
    button: { background: 'linear-gradient(to right, #7e22ce, #db2777)', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, transition: 'opacity 0.2s' },
    buttonDisabled: { backgroundColor: '#a0aec0', color: '#e2e8f0', cursor: 'not-allowed', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 600 },
    errorMessage: { color: '#e53e3e', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' },
    successMessage: { color: '#38a169', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' },
    loadingMessage: { color: '#7e22ce', fontSize: '1rem', textAlign: 'center', marginTop: '1rem' },
};

export default UploadReports;