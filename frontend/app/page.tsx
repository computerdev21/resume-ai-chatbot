'use client';

import { useState } from 'react';

export default function Home() {
    const [resumeText, setResumeText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setResumeText('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await fetch('http://localhost:5001/api/upload/resume', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            setResumeText(data.text || 'No text extracted.');
        } catch (err) {
            setResumeText('Upload failed.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50 text-black">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">📄 Upload Resume</h1>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4"
            />

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? 'Uploading...' : 'Upload Resume'}
            </button>

            {resumeText && (
                <div className="mt-6 w-full max-w-2xl p-4 bg-white rounded shadow whitespace-pre-wrap text-sm">
                    <strong>Extracted Resume Text:</strong>
                    <hr className="my-2" />
                    {resumeText}
                </div>
            )}
        </main>
    );
}
