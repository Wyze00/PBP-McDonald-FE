import React, { useState } from 'react';
import ErrorBanner from '../../components/ErrorBanner';
import LoadingOverlay from '../../components/LoadingOverlay';
import type { ResponseError } from '../../types/response.type';

export default function ResetPasswordPage(): React.JSX.Element {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    email 
                }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const result = await response.json() as ResponseError;
                setError(result.error);
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-10">
                <h1 className="text-2xl font-black text-gray-800 uppercase mb-2">Reset Password</h1>
                
                {success ? (
                    <div className="text-green-600 font-medium bg-green-50 p-4 rounded-xl">
                        Instruksi reset password telah dikirim ke email Anda. Silakan cek kotak masuk Anda.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-gray-500 text-sm">Masukkan email yang terdaftar untuk menerima link reset password.</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C] outline-none transition-all"
                                placeholder="your-email@mail.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#DA291C] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#C82115] transition-all"
                        >
                            SEND RESET LINK
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}