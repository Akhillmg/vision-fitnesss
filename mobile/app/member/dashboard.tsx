import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function MemberDashboard() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-black p-6">
            <View className="flex-row justify-between items-center mb-8 mt-12">
                <View>
                    <Text className="text-3xl font-bold text-white">Welcome back,</Text>
                    <Text className="text-xl text-emerald-500 font-bold">Member</Text>
                </View>
                <TouchableOpacity
                    className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center"
                    onPress={() => router.replace("/")}
                >
                    <Text className="text-white">LO</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-white text-lg font-bold mb-4">Quick Stats</Text>
            <View className="flex-row gap-4 mb-8">
                <View className="flex-1 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <Text className="text-zinc-400 text-sm">Total Workouts</Text>
                    <Text className="text-2xl font-bold text-white mt-1">12</Text>
                </View>
                <View className="flex-1 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <Text className="text-zinc-400 text-sm">Streak</Text>
                    <Text className="text-2xl font-bold text-white mt-1">3 Days</Text>
                </View>
            </View>

            <View className="bg-emerald-900/20 border border-emerald-500/50 p-6 rounded-xl mb-6">
                <Text className="text-emerald-500 font-bold text-lg mb-2">Today's Workout</Text>
                <Text className="text-white text-2xl font-bold mb-4">Push Day A</Text>
                <TouchableOpacity className="bg-emerald-500 p-4 rounded-lg items-center">
                    <Text className="text-black font-bold">Start Workout</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-4">
                <Text className="text-white font-bold text-lg">View History</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
