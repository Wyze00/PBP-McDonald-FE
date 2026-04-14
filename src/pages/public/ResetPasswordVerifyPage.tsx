import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import ErrorBanner from '../../components/ErrorBanner';
import LoadingOverlay from '../../components/LoadingOverlay';
import type { ResponseError } from '../../types/response.type';

export default function ResetPasswordVerifyPage(): React.JSX.Element {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return setError('Token tidak ditemukan.');

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: newPassword }),
            });

            if (response.ok) {
                alert('Password berhasil diperbarui! Silakan login kembali.');
                navigate('/login');
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
                <h1 className="text-2xl font-black text-gray-800 uppercase mb-6">Create New Password</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#DA291C] outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#DA291C] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#C82115] transition-all"
                    >
                        UPDATE PASSWORD
                    </button>
                </form>
            </div>
        </div>
    );
}