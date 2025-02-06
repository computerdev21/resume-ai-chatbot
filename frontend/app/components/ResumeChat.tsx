'use client';

import React, { useState } from 'react';

interface ResumeChatProps {
    resumeText: string;
}

const ResumeChat: React.FC<ResumeChatProps> = ({ resumeText }) => {
    const [chatInput, setChatInput] = useState('');
    const [chatLog, setChatLog] = useState<{ sender: string; message: string }[]>([]);
    const [chatLoading, setChatLoading] = useState(false);

    const handleChat = async () => {
        if (!chatInput.trim()) return;
        const message = chatInput.trim();

        setChatLog((prev) => [...prev, { sender: 'user', message }]);
        setChatInput('');
        setChatLoading(true);

        try {
            const res = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: `${resumeText}\n\nUser: ${message}` }),
            });

            const data = await res.json();
            setChatLog((prev) => [...prev, { sender: 'ai', message: data.reply }]);
        } catch (err) {
            setChatLog((prev) => [...prev, { sender: 'ai', message: '⚠️ Failed to get AI response.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">💬 Chat With IntraBot</h2>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-2 text-sm">
                {chatLog.map((entry, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded ${
                            entry.sender === 'user' ? 'bg-blue-50 self-end' : 'bg-gray-100 self-start'
                        }`}
                    >
                        <strong>{entry.sender === 'user' ? 'You' : 'IntraBot'}:</strong> {entry.message}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    className="flex-1 border px-3 py-2 rounded shadow-sm"
                    placeholder="Ask about your resume..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                />
                <button
                    onClick={handleChat}
                    disabled={chatLoading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {chatLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ResumeChat;