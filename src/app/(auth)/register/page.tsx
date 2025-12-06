"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [name, setName] = useState('')
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
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Registration failed')
                setLoading(false)
                return
            }

            router.push('/login?registered=true')
        } catch (err) {
            setError('Something went wrong')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6 shadow-2xl">
            <h2 className="text-xl font-medium text-white">Create an account</h2>
            {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg">{error}</div>}

            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="John Doe"
                    required
                />
            </div>

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
                {loading ? <Loader2 className="animate-spin text-black" /> : 'Create Account'}
            </button>

            <div className="text-center text-sm text-zinc-500">
                Already have an account? <Link href="/login" className="text-emerald-500 hover:underline">Log in</Link>
            </div>
        </form>
    )
}
