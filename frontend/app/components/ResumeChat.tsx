'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
    resumeText: string;
    formatMarkdown?: boolean;
    followUpPrompt?: string;
}

export default function ResumeChat({ formatMarkdown = false, followUpPrompt }: Props) {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const sendMessage = async (customPrompt?: string) => {
        const finalPrompt = customPrompt || prompt.trim();
        if (!finalPrompt) return;

        const userMsg = { role: 'user' as const, content: finalPrompt };
        setMessages((prev) => [...prev, userMsg]);
        setPrompt('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: finalPrompt }),
            });

            const data = await res.json();
            const botMsg = { role: 'bot' as const, content: data.reply || 'No reply received.' };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error('Chat failed', err);
            setMessages((prev) => [
                ...prev,
                { role: 'bot', content: '❌ Failed to get response from ResuM8.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (followUpPrompt) {
            sendMessage(followUpPrompt);
        }
    }, [followUpPrompt]);

    return (
        <div className="w-full max-w-3xl mt-8 bg-white rounded-lg shadow-md text-sm flex flex-col h-[500px]">
            <div className="p-4 border-b text-xl font-semibold text-blue-800">💬 Chat with ResuM8</div>

            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-md ${
                            msg.role === 'user'
                                ? 'bg-blue-100 self-end text-right'
                                : 'bg-purple-100 self-start text-left'
                        }`}
                    >
                        <div className="font-medium mb-1 text-sm text-gray-700">
                            {msg.role === 'user' ? 'You' : 'ResuM8'}
                        </div>
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {formatMarkdown ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t bg-white flex gap-2 items-start">
        <textarea
            ref={inputRef}
            className="flex-1 border rounded p-2 resize-none h-20 focus:outline-blue-300"
            placeholder="Ask ResuM8 about your resume..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
        />
                <button
                    onClick={() => sendMessage()}
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 h-fit rounded hover:bg-purple-700 transition"
                >
                    {loading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
}
