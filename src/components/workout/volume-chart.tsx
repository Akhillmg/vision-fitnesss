"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VolumeChartProps {
    data: { name: string; volume: number; date: string }[];
}

export function VolumeChart({ data }: VolumeChartProps) {
    if (data.length < 2) return null;

    // Reverse data to show oldest to newest if it came in desc order
    const chartData = [...data].reverse();

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Volume Progression (kg)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#52525b"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value: number) => [`${value} kg`, "Volume"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorVolume)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
