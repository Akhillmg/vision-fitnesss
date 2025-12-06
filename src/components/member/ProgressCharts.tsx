"use client"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ProgressCharts({ data }: { data: Record<string, any[]> }) {
    const exercises = Object.keys(data)
    const [selected, setSelected] = useState(exercises[0] || "")

    if (exercises.length === 0) {
        return <div className="text-zinc-500">No data available yet.</div>
    }

    const chartData = data[selected] || []

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <label className="text-zinc-400">Select Exercise:</label>
                <select
                    value={selected}
                    onChange={e => setSelected(e.target.value)}
                    className="bg-black border border-zinc-800 rounded p-2 text-white italic"
                >
                    {exercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-[400px]">
                <h3 className="text-xl font-bold text-white mb-4">Estimated 1RM Progression</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                            itemStyle={{ color: '#10b981' }}
                            formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Est. 1RM']}
                        />
                        <Line type="monotone" dataKey="e1rm" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
