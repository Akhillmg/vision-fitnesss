import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <h1 className="text-6xl font-bold mb-6 tracking-tighter">Antigravity<span className="text-emerald-500">Fit</span></h1>
      <p className="text-xl text-zinc-400 mb-10 text-center max-w-2xl leading-relaxed">
        The ultimate gym progress tracker for serious lifters and trainers. <br />
        Log workouts, track 1RM, and visualize your gains.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm sm:max-w-none justify-center">
        <Link href="/login" className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl font-semibold text-center transition-all">
          Log In
        </Link>
        <Link href="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl font-bold text-center transition-all shadow-lg shadow-emerald-500/20">
          Start Tracking
        </Link>
      </div>
    </div>
  )
}
