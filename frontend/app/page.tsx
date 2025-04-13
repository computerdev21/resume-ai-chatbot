'use client';

import { useState } from 'react';
import UploadForm from './components/UploadForm';
import AnalyzeForm from './components/AnalyzeForm';
import FeedbackCard from './components/FeedbackCard';
import ResumeChat from './components/ResumeChat';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [uploadDone, setUploadDone] = useState(false);

    const handleFileChange = (selectedFile: File) => {
        setFile(selectedFile);
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
        setAnalyzing(true);
        setAnalysis(null);

        try {
            const res = await fetch('http://localhost:5001/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeText, jobDescription: jobDesc }),
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (err) {
            console.error('Analysis failed', err);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen p-6 bg-gray-50 text-black">
            <h1 className="text-3xl font-bold text-blue-700 mb-4">🎯 IntraBot Resume Analyzer</h1>

            <div className="max-w-2xl text-center mb-6 text-gray-700 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">👋 Welcome to IntraBot</h2>
                <p>
                    IntraBot is your personal opensource AI-powered resume assistant.
                    It helps you analyze your resume, gives tailored feedback based on job descriptions,
                    checks ATS compatibility, and suggests improvements.
                </p>
                <p>
                    After uploading your resume, you’ll also be able to chat with IntraBot for real-time,
                    resume-specific advice and career guidance.
                </p>
                <p className="text-blue-600 font-medium">
                    🎯 Upload your resume now and level up your job applications!
                </p>
            </div>
            <UploadForm onFileChange={handleFileChange} onUpload={handleUpload} uploading={loading || analyzing}/>

            {uploadDone && (
                <AnalyzeForm
                    jobDesc={jobDesc}
                    onJobDescChange={setJobDesc}
                    onAnalyze={handleAnalyze}
                    analyzing={analyzing}
                />
            )}

            {analysis && <FeedbackCard analysis={analysis}/>}

            {resumeText && <ResumeChat resumeText={resumeText} formatMarkdown={true}/>}
        </main>
    );
}
