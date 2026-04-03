import { useMemo, type PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router';
import logo from '../assets/logo.png';
import Footer from './Footer';

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function Header(pwc: PropsWithChildren): React.JSX.Element {
    const location = useLocation();

    const breadcrumb = useMemo(() => {
        const segments = location.pathname.split('/').filter(Boolean);
        if (segments.length === 0) return 'Home';
        return segments
            .map((segment) => segment.replace(/-/g, ' '))
            .join(' > ');
    }, [location.pathname]);

    const isAuthenticated = useMemo(() => Boolean(getCookie('token')), [location.pathname]);

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
                        <Link
                            to="/logout"
                            className="rounded-full px-6 py-2 bg-white text-[#DA291C] font-bold hover:bg-yellow-400 hover:text-black transition-all duration-200 shadow-md"
                        >
                            Logout
                        </Link>
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