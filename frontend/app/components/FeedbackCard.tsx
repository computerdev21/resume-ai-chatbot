'use client';

import React from 'react';

interface FeedbackCardProps {
    analysis: any;
    onFollowUp: (prompt: string) => void;
}

export default function FeedbackCard({ analysis, onFollowUp }: FeedbackCardProps) {
    return (
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-4 text-sm mt-6">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">📊 AI Feedback</h2>

            {analysis.suggested_roles && (
                <div>
                    <strong className="text-gray-700">Suggested Roles:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.suggested_roles.map((role: string, idx: number) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                {role}
              </span>
                        ))}
                    </div>
                </div>
            )}

            {analysis.score !== undefined && (
                <div>
                    <strong className="text-gray-700">Score:</strong>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${analysis.score}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{analysis.score}/100</p>
                    <button
                        onClick={() => onFollowUp('how to improve my resume score')}
                        className="text-xs text-blue-600 hover:underline mt-1"
                    >
                        💬 How can I increase this?
                    </button>
                </div>
            )}

            {typeof analysis.ats_compliant === 'boolean' && (
                <p>
                    <strong className="text-gray-700">ATS Compliant:</strong>{' '}
                    <span
                        className={`font-semibold ${
                            analysis.ats_compliant ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
            {analysis.ats_compliant ? '✅ Yes' : '❌ No'}
          </span>
                </p>
            )}

            {analysis.missing_skills?.length > 0 && (
                <div>
                    <strong className="text-gray-700">Missing Skills:</strong>
                    <ul className="list-disc ml-6 mt-1">
                        {analysis.missing_skills.map((skill: string, idx: number) => (
                            <li key={idx} className="flex justify-between">
                                {skill}
                                <button
                                    onClick={() => onFollowUp(`Why is "${skill}" important for my resume?`)}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Ask why
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {analysis.suggestions?.length > 0 && (
                <div>
                    <strong className="text-gray-700">Suggestions:</strong>
                    <ul className="list-disc ml-6 mt-1 space-y-1">
                        {analysis.suggestions.map((tip: string, idx: number) => (
                            <li key={idx} className="flex justify-between items-center">
                                <span>{tip}</span>
                                <button
                                    onClick={() => onFollowUp(tip)}
                                    className="text-xs text-blue-600 hover:underline ml-2"
                                >
                                    Elaborate 💬
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {analysis.raw && (
                <div>
                    <strong className="text-gray-700">⚠️ Raw Output:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-2 text-xs whitespace-pre-wrap">
            {analysis.raw}
          </pre>
                </div>
            )}
        </div>
    );
}
