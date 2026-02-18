'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">500</h1>
                <h2 className="text-3xl font-semibold text-gray-200 mb-4">Server Error</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                    Something went wrong on our end. Please try again later.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}