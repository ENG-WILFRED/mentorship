import React from 'react';
import Link from 'next/link';

// --- Mock Data ---
// In a real application, this data would come from an API.

const kpiData = {
    totalMentors: 150,
    totalMentees: 450,
    activePairs: 120,
    completedMentorships: 320,
    avgSatisfaction: 4.7, // out of 5
};

const mentorshipActivityData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'New Pairings',
            data: [12, 19, 15, 25, 22, 30],
            // In a real chart library, you'd have colors, etc.
        },
        {
            label: 'Completed Mentorships',
            data: [5, 8, 10, 7, 12, 15],
        },
    ],
};

const topMentorsData = [
    { id: 1, name: 'Alice Johnson', mentees: 5, hours: 40, satisfaction: 4.9 },
    { id: 2, name: 'Bob Williams', mentees: 4, hours: 35, satisfaction: 4.8 },
    { id: 3, name: 'Charlie Brown', mentees: 4, hours: 32, satisfaction: 4.9 },
    { id: 4, name: 'Diana Miller', mentees: 3, hours: 30, satisfaction: 4.7 },
];

const recentPairingsData = [
    { id: 101, mentor: 'Eve Davis', mentee: 'Frank White', date: '2023-06-15' },
    { id: 102, mentor: 'Grace Lee', mentee: 'Heidi Green', date: '2023-06-12' },
    { id: 103, mentor: 'Ivan Hall', mentee: 'Judy King', date: '2023-06-10' },
];

// --- Component Interfaces ---

interface KpiCardProps {
    title: string;
    value: string | number;
    description: string;
}

interface ChartProps {
    title: string;
    data: typeof mentorshipActivityData;
}

interface TableProps<T> {
    title: string;
    columns: { key: keyof T; header: string }[];
    data: T[];
}

// --- Reusable Components ---
// These would typically be in their own files (e.g., /components/Card.tsx)

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description }) => (
    <div style={styles.kpiCard}>
        <h3 style={styles.kpiValue}>{value}</h3>
        <p style={styles.kpiTitle}>{title}</p>
        <p style={styles.kpiDescription}>{description}</p>
    </div>
);

const Chart: React.FC<ChartProps> = ({ title, data }) => (
    <div style={styles.chartContainer}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        {/* In a real app, you would use a charting library like Chart.js or Recharts */}
        <div style={styles.chartPlaceholder}>
            <p>Chart for: {data.datasets.map(d => d.label).join(' & ')}</p>
            <p>Labels: {data.labels.join(', ')}</p>
        </div>
    </div>
);

const DataTable = <T extends { id: number }>({ title, columns, data }: TableProps<T>) => (
    <div style={styles.tableContainer}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <table style={styles.table}>
            <thead>
                <tr>
                    {columns.map(col => <th key={String(col.key)} style={styles.th}>{col.header}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        {columns.map(col => (
                            <td key={String(col.key)} style={styles.td}>
                                {String(row[col.key])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// --- Main Reports Page Component ---

const ReportsPage: React.FC = () => {
    const topMentorsColumns = [
        { key: 'name' as const, header: 'Mentor Name' },
        { key: 'mentees' as const, header: 'Active Mentees' },
        { key: 'hours' as const, header: 'Hours Logged' },
        { key: 'satisfaction' as const, header: 'Satisfaction' },
    ];

    const recentPairingsColumns = [
        { key: 'mentor' as const, header: 'Mentor' },
        { key: 'mentee' as const, header: 'Mentee' },
        { key: 'date' as const, header: 'Pairing Date' },
    ];
    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Mentorship Program Reports</h1>
                    <p style={styles.subtitle}>Dashboard for program health and activity.</p>
                </div>
                <div style={styles.headerActions}>
                    <Link href="/mentor/dashboard" passHref>
                        <button style={{...styles.button, ...styles.buttonSecondary}}>Back to Dashboard</button>
                    </Link>
                    <Link href="/mentor/report/upload" passHref>
                        <button style={styles.button}>Upload Report</button>
                    </Link>
                </div>
            </header>

            {/* KPI Section */}
            <section style={styles.kpiGrid}>
                <KpiCard title="Total Mentors" value={kpiData.totalMentors} description="All registered mentors" />
                <KpiCard title="Total Mentees" value={kpiData.totalMentees} description="All registered mentees" />
                <KpiCard title="Active Pairings" value={kpiData.activePairs} description="Currently active mentorships" />
                <KpiCard title="Overall Satisfaction" value={`${kpiData.avgSatisfaction} / 5`} description="Average from post-mentorship surveys" />
            </section>

            {/* Charts Section */}
            <section style={styles.section}>
                <Chart title="Mentorship Activity (Last 6 Months)" data={mentorshipActivityData} />
            </section>

            {/* Data Tables Section */}
            <section style={styles.gridSection}>
                <DataTable title="Top Performing Mentors" columns={topMentorsColumns} data={topMentorsData} />
                <DataTable title="Recent Pairings" columns={recentPairingsColumns} data={recentPairingsData} />
            </section>
        </div>
    );
};

// --- Styles ---
// Basic styling for layout. In a real app, use a CSS-in-JS library or CSS modules.

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        fontFamily: 'sans-serif',
        padding: '1rem',
        background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff, #fce7f3)', // indigo-100, purple-100, pink-100
        color: '#4a5568',
    },
    header: {
        marginBottom: '2rem',
        borderBottom: '1px solid #d8b4fe', // purple-300
        paddingBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap', // Allow header items to wrap on small screens
        gap: '1rem', // Add space between wrapped items
    },
    title: {
        margin: 0,
        fontSize: '2rem',
        color: '#6b21a8', // purple-800
    },
    subtitle: {
        margin: '0.25rem 0 0',
        fontSize: '1rem',
        color: '#7e22ce', // purple-700
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
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
        border: '1px solid #e9d5ff', // purple-200
    },
    kpiValue: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0 0 0.5rem',
        color: '#7e22ce', // purple-700
    },
    kpiTitle: {
        fontSize: '1rem',
        fontWeight: '600',
    },
    kpiDescription: {
        fontSize: '0.875rem',
        color: '#718096',
        margin: '0.25rem 0 0',
    },
    section: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9d5ff', // purple-200
        marginBottom: '2rem',
    },
    gridSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', // Responsive grid for tables
        gap: '2rem',
    },
    sectionTitle: {
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.25rem', color: '#6b21a8', // purple-800
    },
    chartContainer: {
        // Styles for the chart container
    },
    chartPlaceholder: {
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#edf2f7',
        borderRadius: '8px',
        color: '#4a5568',
    },
    tableContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9d5ff', // purple-200
        overflowX: 'auto', // Allow tables to scroll horizontally if needed
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '0.75rem',
        borderBottom: '2px solid #d8b4fe', // purple-300
        backgroundColor: 'rgba(243, 232, 255, 0.5)', // purple-100 with opacity
    },
    td: {
        textAlign: 'left',
        padding: '0.75rem',
        borderBottom: '1px solid #e9d5ff', // purple-200
    },
    headerActions: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap', // Allow buttons to wrap
    },
    button: {
        background: 'linear-gradient(to right, #7e22ce, #db2777)', // purple-700 to pink-600
        color: 'white',
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 600,
        transition: 'background-color 0.2s',
        textDecoration: 'none',
    },
    buttonSecondary: {
        background: 'rgba(255, 255, 255, 0.7)',
        color: '#6b21a8', // purple-800
        border: '1px solid #d8b4fe', // purple-300
    },
};

export default ReportsPage;