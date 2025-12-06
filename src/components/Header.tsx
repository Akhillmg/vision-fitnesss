export function Header({ userName }: { userName?: string | null }) {
    return (
        <header className="h-16 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 md:px-8 md:ml-64 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
            <div className="md:hidden text-emerald-500 font-bold text-xl">
                AG Fit
            </div>
            <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-zinc-400 hidden sm:inline">Welcome, <span className="text-white font-medium">{userName || 'Member'}</span></span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                    {userName?.[0]?.toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    )
}
