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
                <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-4 text-sm">
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
                                <div
                                    className="bg-green-500 h-4 rounded-full"
                                    style={{ width: `${analysis.score}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{analysis.score}/100</p>
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

                    {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                        <div>
                            <strong className="text-gray-700">Missing Skills:</strong>
                            <ul className="list-disc ml-6 mt-1">
                                {analysis.missing_skills.map((skill: string, idx: number) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                        <div>
                            <strong className="text-gray-700">Suggestions:</strong>
                            <ul className="list-disc ml-6 mt-1">
                                {analysis.suggestions.map((tip: string, idx: number) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {analysis.raw && (
                        <div>
                            <strong className="text-gray-700">⚠️ Raw Output:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-2 text-xs whitespace-pre-wrap">{analysis.raw}</pre>
                        </div>
                    )}
                </div>
            )}

        </main>
    );
}
