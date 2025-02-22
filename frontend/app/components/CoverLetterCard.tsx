'use client';

import React, { useRef, useEffect } from 'react';

interface CoverLetterCardProps {
    coverLetter: string;
    scrollToLetter?: boolean; // if true, we'll auto-scroll
}

export default function CoverLetterCard({ coverLetter, scrollToLetter }: CoverLetterCardProps) {
    const letterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollToLetter && coverLetter && letterRef.current) {
            letterRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [scrollToLetter, coverLetter]);

    if (!coverLetter) return null;

    return (
        <div
            ref={letterRef}
            className="w-full max-w-3xl mt-4 bg-white p-6 rounded-lg shadow-md text-sm space-y-2"
        >
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">📄 Generated Cover Letter</h3>
            <div className="prose whitespace-pre-wrap text-sm text-gray-700">{coverLetter}</div>
        </div>
    );
}
