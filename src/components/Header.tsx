import { useCallback, useEffect, useMemo, type PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router';
import logo from '../assets/logo.png';
import Footer from './Footer';
import type { LoginResponse } from '../types/login.type';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { userSlice } from '../redux/user.slice';
import { useAppSelector } from '../hooks/useAppSelector';

export default function Header(pwc: PropsWithChildren): React.JSX.Element {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const breadcrumb = useMemo(() => {
        const segments = location.pathname.split('/').filter(Boolean);
        if (segments.length === 0) return 'Home';
        return segments
            .map((segment) => segment.replace(/-/g, ' '))
            .join(' > ');
    }, [location.pathname]);


    useEffect(() => {

        const authenticate = async () => {

            const response = await fetch('/api/auth/status', {
                method: 'GET',
                credentials: 'include',
            })

            const result: LoginResponse = await response.json();

            if (response.status == 200 && result.data) {
                dispatch(userSlice.actions.setState(result.data));
            }
        }

        authenticate();
    }, [])

    const handleLogout = useCallback(() => {
        const logout = async () => {

            const response = await fetch('/api/auth/logout', {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.status == 200) {
                dispatch(userSlice.actions.resetState());
            }
        }

        logout();
    }, [])

    const user = useAppSelector((state) => state.user);
    const isAuthenticated = useMemo(() => {
        return user.username !== '';
    }, [user.username]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-[#DA291C] z-50">
                <div className="w-full px-6 py-3 flex items-center justify-between">
                    
                    {/* Logo dan Breadcrumb */}
                    <div className="flex items-center gap-6">
                        <Link to="/">
                            <img 
                                src={logo} 
                                alt="McDonald Logo" 
                                className="w-12 h-12 object-contain hover:scale-105 transition-transform" 
                            />
                        </Link>
                        
                        <div className="h-8 w-[1px] bg-white/30 ml-2"></div> 
                        
                        <nav className="text-lg font-bold text-white capitalize tracking-wide">
                            {breadcrumb}
                        </nav>
                    </div>

                    {/* Tombol Logout */}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="rounded-full px-6 py-2 bg-white text-[#DA291C] font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200 shadow-md"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </header>

            <main className="pt-[70px]">
                {pwc.children}
            </main>

            <Footer />
        </>
    );
}