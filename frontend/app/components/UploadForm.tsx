'use client';

import React from 'react';

interface UploadFormProps {
    onFileChange: (file: File) => void;
    onUpload: () => void;
    uploading: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onFileChange, onUpload, uploading }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileChange(file);
    };

    return (
        <div className="mb-6">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
            <button
                onClick={onUpload}
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
        </div>
    );
};

export default UploadForm;