'use client';

import React from 'react';

interface AnalyzeFormProps {
    jobDesc: string;
    onJobDescChange: (val: string) => void;
    onAnalyze: () => void;
    analyzing: boolean;
    onGenerateCover: () => void;
}

export default function AnalyzeForm({
                                        jobDesc,
                                        onJobDescChange,
                                        onAnalyze,
                                        analyzing,
                                        onGenerateCover,
                                    }: AnalyzeFormProps) {
    const jdTrimmed = jobDesc.trim();

    return (
        <div className="w-full max-w-2xl mb-6 flex flex-col items-center">
      <textarea
          placeholder="Paste job description or leave empty for general feedback..."
          className="w-full p-4 border rounded shadow resize-none h-40 mb-4"
          value={jobDesc}
          onChange={(e) => onJobDescChange(e.target.value)}
      />
            <div className="flex gap-4">
                <button
                    onClick={onAnalyze}
                    disabled={analyzing}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    {analyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>

                {/* Only enable if JD is non-empty */}
                <button
                    onClick={onGenerateCover}
                    disabled={analyzing || !jdTrimmed}
                    className={`px-4 py-2 rounded text-white transition ${
                        analyzing || !jdTrimmed
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    ✍️ Generate Cover Letter
                </button>
            </div>
        </div>
    );
}
