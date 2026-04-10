"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendOTP(phone: string) {
  const supabase = await createClient();
  const fullPhone = `+91${phone}`;

  const { error } = await supabase.auth.signInWithOtp({
    phone: fullPhone,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function verifyOTP(phone: string, token: string) {
  const supabase = await createClient();
  const fullPhone = `+91${phone}`;

  const { data, error } = await supabase.auth.verifyOtp({
    phone: fullPhone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: error.message };
  }

  // Check if profile is complete
  if (data?.user) {
    const { data: userRow } = await supabase
      .from("users")
      .select("profile_complete")
      .eq("id", data.user.id)
      .single();

    if (!userRow || !(userRow as any).profile_complete) {
      return { success: true, redirect: "/onboarding" };
    }
    return { success: true, redirect: "/home" };
  }

  return { success: true, redirect: "/home" };
}

export async function saveOnboardingProfile(formData: {
  fullName: string;
  courseLevel: string;
  field: string;
  year?: number;
  institution: string;
  percentage?: number;
  category: string;
  gender: string;
  religion?: string;
  state: string;
  incomeRange: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Upsert user record
  await (supabase.from("users") as any).upsert({
    id: user.id,
    phone: user.phone ?? "",
    full_name: formData.fullName,
    profile_complete: true,
  });

  // Upsert profile
  await (supabase.from("profiles") as any).upsert({
    user_id: user.id,
    course_level: formData.courseLevel as any,
    field: formData.field,
    year: formData.year ?? null,
    institution: formData.institution,
    percentage: formData.percentage ?? null,
    category: formData.category as any,
    gender: formData.gender as any,
    religion: formData.religion ?? null,
    state: formData.state,
    income_range: formData.incomeRange as any,
  });

  redirect("/home");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
