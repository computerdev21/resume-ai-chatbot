'use client';

import React from 'react';

interface AnalyzeFormProps {
    jobDesc: string;
    onJobDescChange: (val: string) => void;
    onAnalyze: () => void;
    analyzing: boolean;
}

const AnalyzeForm: React.FC<AnalyzeFormProps> = ({ jobDesc, onJobDescChange, onAnalyze, analyzing }) => {
    return (
        <div className="w-full max-w-2xl mb-6">
      <textarea
          placeholder="Paste job description or leave empty for general feedback..."
          className="w-full p-4 border rounded shadow resize-none h-40"
          value={jobDesc}
          onChange={(e) => onJobDescChange(e.target.value)}
      />
            <button
                onClick={onAnalyze}
                disabled={analyzing}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
                {analyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
        </div>
    );
};

export default AnalyzeForm;