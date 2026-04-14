export default function NotFound(): React.JSX.Element {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 text-center">
                
                {/* Content */}
                <div className="relative mb-8">
                    <div className="text-[12rem] font-black text-gray-100 select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl md:text-8xl">🍟</span>
                    </div>
                </div>

                {/* Deskripsi */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Oops! Halaman Tidak Ditemukan
                </h1>
            </main>
        </div>
    );
}