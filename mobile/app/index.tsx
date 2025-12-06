import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

                <Text className="text-4xl font-bold text-white tracking-widest">FITNESS</Text>
                <Text className="text-zinc-500 mt-2">Mobile Companion App</Text>
            </View >

    <View className="w-full space-y-4">
        <View>
            <Text className="text-zinc-400 mb-2 ml-1">Email</Text>
            <TextInput
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white"
                placeholder="Enter your email"
                placeholderTextColor="#52525b"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
        </View>

        <View className="mt-4">
            <Text className="text-zinc-400 mb-2 ml-1">Password</Text>
            <TextInput
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white"
                placeholder="Enter your password"
                placeholderTextColor="#52525b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
        </View>

        <TouchableOpacity
            className="w-full bg-emerald-500 p-4 rounded-xl items-center mt-6"
            onPress={handleLogin}
        >
            <Text className="text-black font-bold text-lg">Sign In</Text>
        </TouchableOpacity>
    </View>
        </View >
    );
}
