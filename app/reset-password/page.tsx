import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/app/reset-password/reset-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Reset password" };

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=recovery");
  return <ResetPasswordForm/>;
}
