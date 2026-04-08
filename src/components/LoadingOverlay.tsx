export default function LoadingOverlay(): React.JSX.Element {
    return (
        <>
            <div className="fixed inset-0 z-[100] bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#DA291C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </>
    );
}