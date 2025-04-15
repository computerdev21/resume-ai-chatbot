'use client';

import { useState } from 'react';

interface Props {
    onFileChange: (file: File) => void;
    onUpload: () => void;
    uploading: boolean;
}

export default function UploadForm({ onFileChange, onUpload, uploading }: Props) {
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [uploaded, setUploaded] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file);
            setSelectedFileName(file.name);
            setUploaded(false);
        }
    };

    const handleUpload = async () => {
        setUploaded(false);
        await onUpload();
        setUploaded(true);
    };

    return (
        <div className="w-full max-w-xl mb-6 flex flex-col items-center space-y-4">
            {/* File input */}
            <input
                type="file"
                accept=".pdf"
                id="resumeInput"
                onChange={handleFileChange}
                className="hidden"
            />
            <label
                htmlFor="resumeInput"
                className={`cursor-pointer bg-white border-2 border-dashed border-blue-500 px-6 py-3 rounded-lg text-blue-600 font-medium transition duration-200 hover:bg-blue-50 active:scale-95 ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {uploading ? 'Uploading Disabled' : '📁 Choose PDF Resume'}
            </label>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={uploading || !selectedFileName}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 
        ${
                    uploading || !selectedFileName
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
            >
                {uploading && (
                    <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z"
                        />
                    </svg>
                )}
                {uploading ? 'Uploading...' : '⬆️ Upload Resume'}
            </button>

            {/* File info */}
            {selectedFileName && (
                <div className="text-sm text-gray-700">
                    📄 <span className="font-medium">{selectedFileName}</span>
                </div>
            )}

            {/* Upload confirmation */}
            {uploaded && (
                <div className="text-green-700 font-semibold text-sm mt-1">
                    ✅ Upload complete! Ready to analyze your resume.
                </div>
            )}
        </div>
    );
}
