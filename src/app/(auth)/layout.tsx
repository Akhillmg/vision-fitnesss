export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-emerald-500/30">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">Antigravity<span className="text-emerald-500">Fit</span></h1>
                    <p className="text-zinc-500 mt-2">Track your progress. Crush your goals.</p>
                </div>
                {children}
            </div>
        </div>
    )
}
