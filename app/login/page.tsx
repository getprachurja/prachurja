import { LoginForm } from "@/app/login/login-form";

export const metadata = { title: "Portal sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; reset?: string }> }) {
  const params = await searchParams;
  const notice = params.error === "confirmation"
    ? "That verification link is invalid or has expired. Request a new email below and use the newest link."
    : params.error === "recovery"
      ? "That password-reset link is invalid or has expired. Request a new link below."
    : undefined;
  const message = params.reset === "success" ? "Password updated successfully. Sign in with your new password." : undefined;
  return <LoginForm initialNotice={notice} initialMessage={message}/>;
}
