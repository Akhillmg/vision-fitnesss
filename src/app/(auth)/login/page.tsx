"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (res?.error) {
                setError('Invalid email or password')
                setLoading(false)
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            setError('Something went wrong')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6 shadow-2xl">
            <h2 className="text-xl font-medium text-white">Log in to your account</h2>
            {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg">{error}</div>}

            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
                {loading ? <Loader2 className="animate-spin text-black" /> : 'Log In'}
            </button>

            <div className="text-center text-sm text-zinc-500">
                Don't have an account? <Link href="/register" className="text-emerald-500 hover:underline">Sign up</Link>
            </div>
        </form>
    )
}
