'use client';

import { useState } from 'react';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [uploadDone, setUploadDone] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        setUploadDone(false);
        setAnalysis(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await fetch('http://localhost:5001/api/upload/resume', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            setResumeText(data.text || '');
            setUploadDone(true);
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!resumeText) return;

        setLoading(true);
        setAnalysis(null);

        try {
            console.log("Sending to AI:", {
                resumeText,
                jobDescription: jobDesc,
            });
            const res = await fetch('http://localhost:5001/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText,
                    jobDescription: jobDesc,
                }),
            });

            const data = await res.json();
            setAnalysis(data);
        } catch (err) {
            console.error('Analysis failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-6 bg-gray-50 text-black">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">🎯 IntraBot Resume Analyzer</h1>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4"
            />

            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
            >
                {loading ? 'Uploading...' : 'Upload Resume'}
            </button>

            {uploadDone && (
                <div className="w-full max-w-2xl mb-6">
          <textarea
              placeholder="Paste job description or leave empty for general feedback..."
              className="w-full p-4 border rounded shadow resize-none h-40"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
          />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Resume'}
                    </button>
                </div>
            )}

            {analysis && (
                <div className="w-full max-w-2xl bg-white p-4 rounded shadow-md text-sm whitespace-pre-wrap">
                    <h2 className="font-semibold text-lg mb-2">📊 AI Feedback</h2>
                    {analysis.score && <p><strong>Score:</strong> {analysis.score}/100</p>}
                    {typeof analysis.ats_compliant === 'boolean' && (
                        <p><strong>ATS Compliant:</strong> {analysis.ats_compliant ? '✅ Yes' : '❌ No'}</p>
                    )}
                    {analysis.missing_skills && (
                        <div>
                            <strong>Missing Skills:</strong>
                            <ul className="list-disc ml-6">
                                {analysis.missing_skills.map((skill: string, idx: number) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {analysis.suggestions && (
                        <div>
                            <strong>Suggestions:</strong>
                            <ul className="list-disc ml-6">
                                {analysis.suggestions.map((tip: string, idx: number) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {analysis.raw && (
                        <div>
                            <strong>⚠️ Couldn’t parse AI response into JSON — here’s the raw output:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-2">{analysis.raw}</pre>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
