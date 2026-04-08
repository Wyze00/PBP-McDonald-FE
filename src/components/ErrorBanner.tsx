import { useEffect } from "react";

interface ErrorBannerProps {
    error: string,
    setError: React.Dispatch<React.SetStateAction<string>>
}

export default function ErrorBanner({ error, setError }: ErrorBannerProps): React.JSX.Element {

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="fixed top-20 right-4 z-[100] bg-white text-red-600 px-4 py-2 rounded-lg shadow-md flex items-center gap-3 animate-fade-in">
            <span className="text-sm font-bold">⚠️ {error}</span>
            <button 
                onClick={() => setError('')} 
                className="hover:bg-red-50 p-1 rounded-md transition-colors text-black hover:text-red-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}