import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Utensils } from "lucide-react"

export default async function MemberDietPage() {
    const session = await auth()

    const dailyStats = {
        calories: { current: 1240, target: 2400 },
        protein: { current: 80, target: 160 },
        carbs: { current: 120, target: 250 },
        fats: { current: 40, target: 70 },
    }

    const meals = [
        { id: '1', name: 'Oatmeal & Whey', calories: 450, time: 'Breakfast', completed: true },
        { id: '2', name: 'Chicken Rice', calories: 600, time: 'Lunch', completed: true },
        { id: '3', name: 'Greek Yogurt', calories: 190, time: 'Snack', completed: false },
    ]

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Nutrition</h1>
                <Button size="icon" variant="ghost" className="text-red-500">
                    <Plus />
                </Button>
            </div>

            {/* Macro Ring / Summary */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <span className="block text-xl font-bold text-white">{dailyStats.calories.current}</span>
                            <span className="text-[10px] uppercase text-zinc-500">Cals</span>
                        </div>
                        <div>
                            <span className="block text-xl font-bold text-red-500">{dailyStats.protein.current}g</span>
                            <span className="text-[10px] uppercase text-zinc-500">Prot</span>
                        </div>
                        <div>
                            <span className="block text-xl font-bold text-zinc-300">{dailyStats.carbs.current}g</span>
                            <span className="text-[10px] uppercase text-zinc-500">Carbs</span>
                        </div>
                        <div>
                            <span className="block text-xl font-bold text-zinc-300">{dailyStats.fats.current}g</span>
                            <span className="text-[10px] uppercase text-zinc-500">Fats</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Meals List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase">Today's Meals</h3>
                {meals.map(meal => (
                    <Card key={meal.id} className={`border-zinc-800 ${meal.completed ? 'bg-zinc-900/30 opacity-70' : 'bg-zinc-900'}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded flex items-center justify-center ${meal.completed ? 'bg-green-900/20 text-green-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                    <Utensils size={18} />
                                </div>
                                <div>
                                    <p className={`text-base font-bold ${meal.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{meal.name}</p>
                                    <p className="text-xs text-zinc-500">{meal.time} • {meal.calories} kcal</p>
                                </div>
                            </div>
                            <div className="h-6 w-6 rounded border border-zinc-700 flex items-center justify-center">
                                {meal.completed && <div className="h-3 w-3 bg-red-600 rounded-sm" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
