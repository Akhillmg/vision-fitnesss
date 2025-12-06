import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
// Import your global CSS file
import "../global.css";

export default function RootLayout() {
    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />
            <Slot />
        </View>
    );
}
