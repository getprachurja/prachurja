"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PasswordState = { error?: string };

const passwordSchema = z
  .object({
    password: z.string().min(8).max(128),
    confirmation: z.string().min(8).max(128),
  })
  .refine((values) => values.password === values.confirmation, {
    message: "Passwords do not match.",
    path: ["confirmation"],
  });

export async function updatePassword(_state: PasswordState, formData: FormData): Promise<PasswordState> {
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success)
    return {
      error: parsed.error.issues.some((issue) => issue.message === "Passwords do not match.")
        ? "Passwords do not match."
        : "Use a password between 8 and 128 characters.",
    };

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "This password-reset session has expired. Request a new reset link." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "The password could not be updated. Request a new reset link and try again." };
  await supabase.auth.signOut({ scope: "global" });
  redirect("/login?reset=success");
}
