'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
    const [followUpPrompt, setFollowUpPrompt] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('followUpPrompt') || '';
        }
        return '';
    });

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

    const handleFollowUp = (prompt: string) => {
        setFollowUpPrompt(prompt);
        localStorage.setItem('followUpPrompt', prompt);
    };

    return (
        <main
            className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100 text-black font-sans">
            <motion.section
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6, ease: 'easeOut'}}
                className="w-full max-w-3xl text-center mb-8 bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-md border border-gray-200"
            >
                <motion.div
                    className="text-6xl mb-4"
                    animate={{y: [0, -6, 0]}}
                    transition={{repeat: Infinity, duration: 2}}
                >
                    🤖
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Meet ResuM8 — Your AI Resume Assistant</h2>
                <p className="text-gray-600 text-base mb-4">
                    ResuM8 is your personal opensource AI-powered resume assistant.
                    It helps you analyze your resume, gives tailored feedback based on job descriptions,
                    checks ATS compatibility, and suggests improvements.
                </p>
                <p>
                    After uploading your resume, you’ll also be able to chat with ResuM8 for real-time,
                    resume-specific advice and career guidance.
                </p>
                <p className="text-blue-600 font-medium mt-2">
                    🎯 Upload your resume now and level up your job applications!
                </p>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">How it works</h3>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm text-left">
                        <div className="bg-white/70 backdrop-blur rounded-lg p-4 border-l-4 border-blue-500 shadow">
                            <p className="font-semibold">1️⃣ Upload</p>
                            <p className="text-gray-600">Choose your resume as a PDF and upload it securely.</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur rounded-lg p-4 border-l-4 border-green-500 shadow">
                            <p className="font-semibold">2️⃣ Analyze</p>
                            <p className="text-gray-600">
                                Our AI reviews your resume and gives ATS-friendly suggestions.
                            </p>
                        </div>
                        <div className="bg-white/70 backdrop-blur rounded-lg p-4 border-l-4 border-purple-500 shadow">
                            <p className="font-semibold">3️⃣ Chat</p>
                            <p className="text-gray-600">
                                Ask ResuM8 for personalized tips and guidance based on your resume.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4, duration: 0.5}}
                className="w-full flex flex-col items-center gap-6"
            >
                <UploadForm
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={loading || analyzing}
                />

                {uploadDone && (
                    <AnalyzeForm
                        jobDesc={jobDesc}
                        onJobDescChange={setJobDesc}
                        onAnalyze={handleAnalyze}
                        analyzing={analyzing}
                    />
                )}

                {analysis && (
                    <FeedbackCard
                        analysis={analysis}
                        onFollowUp={(topic: string) => handleFollowUp(`Can you elaborate on: ${topic}`)}
                    />
                )}

                {resumeText && (
                    <ResumeChat
                        resumeText={resumeText}
                        followUpPrompt={followUpPrompt}
                        formatMarkdown={true}
                    />
                )}
            </motion.div>

        </main>
    );
}
