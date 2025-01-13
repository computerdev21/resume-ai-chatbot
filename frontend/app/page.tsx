'use client';

import { useState } from 'react';

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.reply || 'No reply received.');
        } catch (error) {
            setResponse('Error connecting to chatbot.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">IntraBot 🤖</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
        <textarea
            className="w-full p-4 border text-black rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Ask for resume tips, interview advice, or feedback..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
        />

                <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Thinking...' : 'Ask IntraBot'}
                </button>
            </form>

            {response && (
                <div className="mt-8 w-full max-w-xl p-4 bg-white rounded-lg shadow-md whitespace-pre-wrap text-black">
                    <strong>IntraBot:</strong> {response}
                </div>
            )}
        </main>
    );
}
