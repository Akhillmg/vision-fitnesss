"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type ActionState = {
    error?: string;
    success?: boolean;
};

export async function signUpAction(prevState: ActionState, formData: FormData): Promise<ActionState> {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const accessCode = formData.get("accessCode") as string;

    const supabase = await createClient();

    // 1. Fetch Gym Config
    const { data: gym, error: gymError } = await supabase
        .from("gym_config")
        .select("id, admin_code, trainer_code")
        .single();

    if (gymError || !gym) {
        return { error: "System Error: Gym settings not found." };
    }

    // 2. Client-Side Role Validation
    if (role === "ADMIN") {
        if (accessCode !== gym.admin_code) return { error: "Invalid Admin Access Code" };
    } else if (role === "TRAINER") {
        if (accessCode !== gym.trainer_code) return { error: "Invalid Trainer Access Code" };
    }
    // Member needs no code.

    // 3. SignUp with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: role,
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: "Registration failed" };
    }

    // 4. Create Public User Record
    const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        full_name: name,
        password: "supabase-auth-managed",
        role: role,
        updated_at: new Date().toISOString(),
    });

    if (dbError) {
        console.error("DB Insert Error:", dbError);
        return { error: "Failed to create user profile: " + dbError.message };
    }

    return { success: true };
}



export async function signInAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function assignRoleAction(prevState: any, formData: FormData) {
    // This action is likely obsolete if we do selection at signup, 
    // but keeping it if you want the multi-step flow later.
    return { error: "Deprecated. Please register with role." };
}
