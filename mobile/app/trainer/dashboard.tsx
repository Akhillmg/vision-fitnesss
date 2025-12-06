import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function TrainerDashboard() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-black p-6">
            <View className="flex-row justify-between items-center mb-8 mt-12">
                <View>
                    <Text className="text-3xl font-bold text-white">Trainer</Text>
                    <Text className="text-xl text-emerald-500 font-bold">Dashboard</Text>
                </View>
                <TouchableOpacity
                    className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center"
                    onPress={() => router.replace("/")}
                >
                    <Text className="text-white">LO</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-white text-lg font-bold mb-4">Management</Text>

            <View className="flex-row gap-4 mb-4">
                <TouchableOpacity className="flex-1 bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-32 justify-between">
                    <View className="w-10 h-10 bg-emerald-500/20 rounded-full items-center justify-center mb-2">
                        <Text className="text-emerald-500 font-bold">U</Text>
                    </View>
                    <Text className="text-white font-bold">Clients</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-32 justify-between">
                    <View className="w-10 h-10 bg-emerald-500/20 rounded-full items-center justify-center mb-2">
                        <Text className="text-emerald-500 font-bold">T</Text>
                    </View>
                    <Text className="text-white font-bold">Templates</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <Text className="text-white font-bold mb-4">Recent Activity</Text>
                <View className="space-y-4">
                    <View className="bg-black p-4 rounded-lg">
                        <Text className="text-white font-bold">Alice Member</Text>
                        <Text className="text-zinc-500 text-sm">Completed "Push Day A"</Text>
                    </View>
                    <View className="bg-black p-4 rounded-lg">
                        <Text className="text-white font-bold">New Client</Text>
                        <Text className="text-zinc-500 text-sm">Joined recently</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
