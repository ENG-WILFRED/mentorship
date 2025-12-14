import React from 'react';
import Link from 'next/link';
import { getDashboardData } from '@/actions/dashboard';
import  MentorshipHeader  from '@/components/MentorshipHeader';
import Footer from '@/components/Footer';

interface Report {
  id: number;
  date: Date;
  topic: string;
  students: number;
  outcome: string;
  school: {
    name: string;
  };
  mission: {
    name: string;
  };

}

const ReportsPage: React.FC = async () => {
  const { reports } = await getDashboardData();

  const totalReports = reports.length;
  const totalStudentsImpacted = reports.reduce((sum: number, r: any) => sum + (r.students || 0), 0);
  const avgStudentsPerReport = totalReports > 0 ? Math.round(totalStudentsImpacted / totalReports) : 0;

  return (
    <div style={styles.page}>
      <MentorshipHeader />
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Mission Reports</h1>
            <p style={styles.subtitle}>Dashboard for all mission reports and activities.</p>
          </div>
          <div style={styles.headerActions}>
            <Link href="/mentor/dashboard" passHref>
              <button style={{...styles.button, ...styles.buttonSecondary}}>← Back to Dashboard</button>
            </Link>
            <Link href="/mentor/report/upload" passHref>
              <button style={styles.button}>+ Upload Report</button>
            </Link>
          </div>
        </header>

        {/* KPI Section */}
        <section style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <h3 style={styles.kpiValue}>{totalReports}</h3>
            <p style={styles.kpiTitle}>Total Reports</p>
            <p style={styles.kpiDescription}>All submitted reports</p>
          </div>
          <div style={styles.kpiCard}>
            <h3 style={styles.kpiValue}>{totalStudentsImpacted}</h3>
            <p style={styles.kpiTitle}>Students Impacted</p>
            <p style={styles.kpiDescription}>Total students across all reports</p>
          </div>
          <div style={styles.kpiCard}>
            <h3 style={styles.kpiValue}>{avgStudentsPerReport}</h3>
            <p style={styles.kpiTitle}>Avg Students/Report</p>
            <p style={styles.kpiDescription}>Average per mission report</p>
          </div>
        </section>

        {/* Reports List */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>All Reports</h2>
          <div style={styles.reportsGrid}>
            {reports.length > 0 ? (
              reports.map((report: any) => (
                <div key={report.id} style={styles.reportCard}>
                  <div style={styles.reportHeader}>
                    <div>
                      <h3 style={styles.reportTitle}>{report.school?.name || 'Unknown School'}</h3>
                      <p style={styles.reportMeta}>
                        Mission: {report.mission?.name || 'N/A'}
                      </p>
                    </div>
                    <span style={styles.reportDate}>
                      {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div style={styles.reportContent}>
                    <p style={styles.reportTopic}>
                      <strong>Topic:</strong> {report.topic}
                    </p>
                    <p style={styles.reportStudents}>
                      <strong>Students:</strong> {report.students}
                    </p>
                    <p style={styles.reportOutcome}>
                      <strong>Outcome:</strong> {report.outcome}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.noReports}>No reports found. Start by uploading a new report.</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    fontFamily: 'sans-serif',
    background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff, #fce7f3)',
    color: '#4a5568',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    marginBottom: '2rem',
    borderBottom: '1px solid #d8b4fe',
    paddingBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#6b21a8',
  },
  subtitle: {
    margin: '0.25rem 0 0',
    fontSize: '1rem',
    color: '#7e22ce',
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(to right, #7e22ce, #db2777)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'opacity 0.2s',
  },
  buttonSecondary: {
    background: '#e9d5ff',
    color: '#6b21a8',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #d8b4fe',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  kpiValue: {
    margin: 0,
    fontSize: '2rem',
    color: '#7e22ce',
    fontWeight: 700,
  },
  kpiTitle: {
    margin: '0.5rem 0 0',
    fontSize: '0.9rem',
    color: '#6b21a8',
    fontWeight: 600,
  },
  kpiDescription: {
    margin: '0.25rem 0 0',
    fontSize: '0.8rem',
    color: '#999',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#6b21a8',
    marginBottom: '1.5rem',
    fontWeight: 600,
  },
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  reportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #d8b4fe',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
    borderBottom: '1px solid #e9d5ff',
    paddingBottom: '0.75rem',
  },
  reportTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#6b21a8',
    fontWeight: 600,
  },
  reportMeta: {
    margin: '0.25rem 0 0',
    fontSize: '0.9rem',
    color: '#999',
  },
  reportDate: {
    fontSize: '0.85rem',
    color: '#7e22ce',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  reportContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  reportTopic: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#4a5568',
  },
  reportStudents: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#4a5568',
  },
  reportOutcome: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#4a5568',
    lineHeight: '1.4',
  },
  noReports: {
    textAlign: 'center',
    color: '#999',
    fontSize: '1rem',
    padding: '2rem',
  },
};


export default ReportsPage;