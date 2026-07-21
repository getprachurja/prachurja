import { LoginForm } from "@/app/login/login-form";

export const metadata = { title: "Portal sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const notice = params.error === "confirmation"
    ? "That verification link is invalid or has expired. Request a new email below and use the newest link."
    : undefined;
  return <LoginForm initialNotice={notice}/>;
}
