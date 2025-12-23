"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUpAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const gymCode = formData.get("gymCode") as string;

    const supabase = await createClient();

    const { data: gym, error: gymError } = await supabase
        .from("Gym")
        .select("id")
        .eq("code", gymCode)
        .single();

    if (gymError || !gym) {
        return { error: "Invalid Gym Code" };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: null,
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: "Registration failed" };
    }

    const { error: dbError } = await supabase.from("User").insert({
        id: authData.user.id,
        email,
        name,
        password: "supabase-auth-managed",
        role: null,
        gymId: gym.id,
        updatedAt: new Date().toISOString(),
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
    const role = formData.get("role") as string;
    const code = formData.get("code") as string;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // Get user's gymId to verify code
    const { data: publicUser, error: fetchError } = await supabase
        .from("User")
        .select("gymId")
        .eq("id", user.id)
        .single();

    if (fetchError || !publicUser) {
        return { error: "User profile not found" };
    }

    // Validate Code if Admin or Trainer
    if (role === "ADMIN" || role === "TRAINER") {
        if (!code) {
            return { error: `Please enter the ${role.toLowerCase()} code.` };
        }

        // Fetch Gym
        const { data: gym, error: gymError } = await supabase
            .from("Gym")
            .select("adminCode, trainerCode")
            .eq("id", publicUser.gymId)
            .single();

        if (gymError || !gym) {
            return { error: "Gym not found" };
        }

        if (role === "ADMIN" && code !== gym.adminCode) {
            return { error: "Invalid Admin Code" };
        }
        if (role === "TRAINER" && code !== gym.trainerCode) {
            return { error: "Invalid Trainer Code" };
        }
    }

    // Update Public User Role
    const { error: updateError } = await supabase
        .from("User")
        .update({ role: role })
        .eq("id", user.id);

    if (updateError) {
        return { error: "Failed to update role in database" };
    }

    // Update Supabase Auth Metadata (for middleware)
    const { error: metaError } = await supabase.auth.updateUser({
        data: { role: role }
    });

    if (metaError) {
        return { error: "Failed to update session role" };
    }

    revalidatePath("/dashboard", "layout");
    redirect("/dashboard"); // Middleware will route to specific dashboard
}
