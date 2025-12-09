"use client";

import React, { useState } from 'react';
import UploadReports from '../UploadReports';
import Link from 'next/link';

const UploadPage = () => {
    const [isLinkHovered, setIsLinkHovered] = useState(false);

    return (
        <div style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff, #fce7f3)', minHeight: '100vh', padding: '2rem' }}>
            <div style={pageStyles.container}>
                <div style={pageStyles.pageHeader}>
                    <div style={pageStyles.breadcrumb}>
                        <Link href="/mentor/dashboard" passHref>
                            <span 
                                style={{
                                    ...pageStyles.breadcrumbLink,
                                    textDecoration: isLinkHovered ? 'underline' : 'none'
                                }}
                                onMouseEnter={() => setIsLinkHovered(true)}
                                onMouseLeave={() => setIsLinkHovered(false)}
                            >
                                Dashboard
                            </span>
                        </Link>
                        <span style={pageStyles.breadcrumbSeparator}>/</span>
                        <Link href="/mentor/report" passHref>
                            <span style={pageStyles.breadcrumbLink}>Reports</span>
                        </Link>
                        <span style={pageStyles.breadcrumbSeparator}>/</span>
                        <span style={pageStyles.breadcrumbCurrent}>Upload Report</span>
                    </div>
                    <Link href="/mentor/report" passHref>
                        <button style={pageStyles.backButton}>&larr; Back to Reports</button>
                    </Link>
                </div>
                <UploadReports />
            </div>
        </div>
    );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '600px', margin: '0 auto' },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    breadcrumb: { fontSize: '0.9rem', color: '#7e22ce', display: 'flex', flexWrap: 'wrap' },
    breadcrumbLink: { 
        color: '#7e22ce', 
        textDecoration: 'none', 
        cursor: 'pointer',
        // Remove the '&:hover' from here
    },
    breadcrumbSeparator: { margin: '0 0.5rem', color: '#a855f7' },
    breadcrumbCurrent: { fontWeight: 600, color: '#6b21a8' },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#7e22ce',
        cursor: 'pointer',
        fontWeight: 600,
        padding: 0,
        whiteSpace: 'nowrap',
    },
};

export default UploadPage;