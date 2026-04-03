
export default function Footer(): React.JSX.Element {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#F4F4F4] border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    
                    {/* Bagian Kiri */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <p className="text-gray-500 text-sm font-medium">
                            I'm lovin' it.
                        </p>
                    </div>


                    {/* Bagian Kanan */}
                    <div className="text-gray-400 text-xs">
                        © {currentYear} McDonald's. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}