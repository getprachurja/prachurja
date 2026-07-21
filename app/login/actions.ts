"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPortalRole, portalRoute } from "@/lib/portal-auth";

export type LoginState = { error?: string; message?: string };

const credentialsSchema = z.object({
  email: z.string().trim().email().max(180).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

function credentials(formData: FormData) {
  return credentialsSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
}

async function confirmationRedirect() {
  const requestHeaders = await headers();
  const configuredOrigin = process.env.PRACHURJA_SITE_URL?.replace(/\/$/, "");
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const requestOrigin = requestHeaders.get("origin");
  const origin = configuredOrigin ?? (productionHost ? `https://${productionHost}` : requestOrigin ?? "http://localhost:3000");
  return origin;
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credentials(formData);
  if (!parsed.success) return { error: "Enter a valid email and a password of at least 8 characters." };
  const role = await getPortalRole(parsed.data.email);
  if (!role) return { error: "This email has not been assigned to a Prachurja workspace." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message === "Email not confirmed" ? "Confirm your email first, then sign in." : "Email or password is incorrect." };
  redirect(portalRoute(role));
}

export async function signup(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credentials(formData);
  if (!parsed.success) return { error: "Enter a valid email and a password of at least 8 characters." };
  const role = await getPortalRole(parsed.data.email);
  if (!role) return { error: "Ask an administrator to assign this email before creating an account." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: await confirmationRedirect(),
      data: { full_name: String(formData.get("name") ?? "").trim().slice(0, 120) },
    },
  });
  if (error) return { error: error.message };
  if (data.session) redirect(portalRoute(role));
  return { message: "Account created. Check your email to confirm it, then return here to sign in." };
}

export async function resendConfirmation(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.string().trim().email().max(180).safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter the email address used to create your account." };
  const email = parsed.data.toLowerCase();
  const role = await getPortalRole(email);
  if (!role) return { error: "This email has not been assigned to a Prachurja workspace." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: await confirmationRedirect() },
  });
  if (error) return { error: error.message };
  return { message: "A new verification email has been sent. Use the newest link only." };
}
