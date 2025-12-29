import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal, User, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getTrainers } from "./actions";

export default async function AdminTrainersPage() {
    const trainers = await getTrainers();

    return (
        <div className="bg-black min-h-screen p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Trainers</h1>
                    <p className="text-zinc-500 mt-2">Manage your fitness trainers and staff</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    <Plus size={18} /> Add Trainer
                </Button>
            </div>

            <Card className="bg-zinc-950 border-zinc-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">All Trainers</CardTitle>
                            <CardDescription>Overview of all active trainers</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search trainers..."
                                className="pl-9 bg-zinc-900 border-zinc-800 text-white focus:ring-red-600"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400">ID</TableHead>
                                <TableHead className="text-zinc-400">Name</TableHead>
                                <TableHead className="text-zinc-400">Specialty</TableHead>
                                <TableHead className="text-zinc-400">Rating</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainers.length === 0 ? (
                                <TableRow className="border-zinc-800">
                                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                        No trainers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                trainers.map((trainer: any) => (
                                    <TableRow key={trainer.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                        <TableCell>
                                            <code className="bg-zinc-900 px-1 py-0.5 rounded text-xs text-zinc-500 font-mono select-all">
                                                {trainer.id.split('-')[0]}...
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{trainer.full_name || "Unknown"}</p>
                                                    <p className="text-sm text-zinc-500">{trainer.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            {trainer.trainer_profiles?.[0]?.specialties || "General Fitness"}
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                {trainer.trainer_profiles?.[0]?.rating || "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${trainer.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}
                                            `}>
                                                {trainer.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-zinc-800 text-zinc-400">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white" align="end">
                                                    <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-zinc-800 text-red-400 cursor-pointer">Suspend Account</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
