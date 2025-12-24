import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getMembershipDetails } from "./actions"
import { Check, CreditCard } from "lucide-react"

export default async function MemberMembershipPage() {
    const { membership } = await getMembershipDetails()

    const plans = [
        {
            name: "Basic Access",
            price: "$29.99",
            features: ["Gym Access", "Locker Room", "Free WiFi"],
            popular: false
        },
        {
            name: "Pro Athlete",
            price: "$59.99",
            features: ["All Basic Features", "Group Classes", "Sauna Access", "1 PT Session/mo"],
            popular: true
        },
        {
            name: "Elite Performance",
            price: "$99.99",
            features: ["All Pro Features", "Unlimited PT", "Nutrition Plan", "Private Locker"],
            popular: false
        }
    ]

    return (
        <div className="p-4 pt-8 bg-black min-h-screen text-white space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Membership Details</h1>
                <Button variant="ghost" className="text-zinc-500 hover:text-white" asChild>
                    <a href="/dashboard/member/home">Back</a>
                </Button>
            </div>

            {membership ? (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Current Membership</CardTitle>
                        <CardDescription>Your active plan details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-sm text-zinc-500">Plan Name</span>
                                <p className="text-2xl font-bold text-white">{membership.plan_name}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-zinc-500">Status</span>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <p className="text-white capitalize">{membership.status}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-zinc-500">Member Since</span>
                                <p className="text-zinc-300">{new Date(membership.start_date || membership.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-zinc-500">Renews On</span>
                                <p className="text-zinc-300">{membership.end_date ? new Date(membership.end_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-zinc-500">Price</span>
                                <p className="text-zinc-300">${membership.price} / month</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200">
                            Manage Subscription
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                        <p className="text-red-400">No active membership found.</p>
                        <p className="text-sm text-red-400/80">Choose a plan below to get started.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <Card key={plan.name} className={`bg-zinc-900 border-zinc-800 flex flex-col ${plan.popular ? 'border-red-600 relative' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-white">{plan.name}</CardTitle>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        <span className="text-zinc-500 text-sm">/month</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                                                <Check className="h-4 w-4 text-red-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className={`w-full ${plan.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-white text-black hover:bg-zinc-200'}`}>
                                        Choose Plan
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
