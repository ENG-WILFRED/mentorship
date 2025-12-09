'use client';

import React, { useState } from 'react';

// --- Helper Components & Icons ---
// Removed UploadIcon, FileIcon, CheckCircleIcon as they are not relevant for form-based input

// --- Main Upload Component ---

const UploadReports: React.FC = () => {
    const [reportTitle, setReportTitle] = useState('');
    const [reportType, setReportType] = useState<'session_summary' | 'progress_report' | 'feedback' | 'other' | ''>('');
    const [mentorName, setMentorName] = useState('');
    const [menteeName, setMenteeName] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [content, setContent] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionStatus('submitting');
        setErrorMessage('');
        
        // Basic validation for report fields
        if (!reportTitle || !reportType || !mentorName || !menteeName || !reportDate || !content) {
            setErrorMessage('Please fill in all required fields for the report.');
            setSubmissionStatus('error');
            return;
        }

        // Simulate API call to add a new report
        try {
            console.log('Submitting report data:', { reportTitle, reportType, mentorName, menteeName, reportDate, content });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // Simulate success or failure
            const success = Math.random() > 0.2; // 80% success rate for demo purposes

            if (success) {
                setSubmissionStatus('success');
                // Clear form fields after successful submission
                setReportTitle('');
                setReportType('');
                setMentorName('');
                setMenteeName('');
                setReportDate('');
                setContent('');
            } else {
                throw new Error('Failed to add report. Please try again.');
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
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
            <p style={styles.subtitle}>Manually create and submit a mentorship report.</p>

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
                    <label htmlFor="reportType" style={styles.label}>Report Type:</label>
                    <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as 'session_summary' | 'progress_report' | 'feedback' | 'other' | '')}
                        style={styles.select}
                        required
                    >
                        <option value="">Select Report Type</option>
                        <option value="session_summary">Session Summary</option>
                        <option value="progress_report">Progress Report</option>
                        <option value="feedback">Feedback Report</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="mentorName" style={styles.label}>Mentor Name:</label>
                    <input
                        type="text"
                        id="mentorName"
                        value={mentorName}
                        onChange={(e) => setMentorName(e.target.value)}
                        style={styles.input}
                        required
                        placeholder="e.g., Alice Johnson"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="menteeName" style={styles.label}>Mentee Name:</label>
                    <input
                        type="text"
                        id="menteeName"
                        value={menteeName}
                        onChange={(e) => setMenteeName(e.target.value)}
                        style={styles.input}
                        required
                        placeholder="e.g., Bob Williams"
                    />
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
                    <label htmlFor="content" style={styles.label}>Report Content:</label>
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
};

export default UploadReports;