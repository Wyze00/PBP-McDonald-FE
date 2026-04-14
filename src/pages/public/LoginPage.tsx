import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import bgImage from '../../assets/image1.png';
import type { LoginResponse } from '../../types/login.type';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { userSlice } from '../../redux/user.slice';
import ErrorBanner from '../../components/ErrorBanner';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function LoginPage(): React.JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result: LoginResponse = await response.json();
  
            if (response.status === 200 && result.data) {
                dispatch(userSlice.actions.setState(result.data));
                
                if (result.data.role.toLowerCase() === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/kitchen');
                }

            } else {
                setError(result.error || 'Login gagal, periksa kembali akun Anda.');
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">

            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            <main className="flex-1 flex items-center justify-center p-4 md:p-10 pt-28">
                <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[500px]">
                    
                    {/* Sisi Kiri */}
                    <div className="hidden md:block md:w-1/2 relative">
                        <img 
                            src={bgImage} 
                            alt="McDonald's Promotion" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Sisi Kanan */}
                    <div className="w-full md:w-1/2 bg-[#ffffff] p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-10 text-center md:text-left">
                            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Login</h1>
                            <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-transparent focus:border-[#DA291C] focus:outline-none transition-all shadow-sm"
                                    placeholder="mcdonald_fan"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-white border-2 border-transparent focus:border-[#DA291C] focus:outline-none transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#DA291C] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:bg-[#C82115] transform hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center"
                            >
                                SIGN IN
                            </button>

                            <div className="mt-4 text-center">
                                <Link to="/reset-password"
                                    className="text-sm font-bold text-gray-400 hover:text-[#DA291C] transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}