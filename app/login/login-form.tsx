"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ArrowRight, KeyRound, Leaf } from "lucide-react";
import { login, requestPasswordReset, resendConfirmation, signup, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm({ initialNotice, initialMessage }: { initialNotice?: string; initialMessage?: string }) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loginState, loginAction, loginPending] = useActionState(login, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signup, initialState);
  const [resendState, resendAction, resendPending] = useActionState(resendConfirmation, initialState);
  const [recoveryState, recoveryAction, recoveryPending] = useActionState(requestPasswordReset, initialState);
  const modeState = mode === "login" ? loginState : mode === "signup" ? signupState : recoveryState;
  const state = resendState.error || resendState.message ? resendState : modeState;
  const pending = mode === "login" ? loginPending || resendPending : mode === "signup" ? signupPending : recoveryPending;
  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";
  const copy = mode === "login"
    ? "Sign in to your assigned administration, client, partner or field workspace."
    : mode === "signup"
      ? "Use an email that a Prachurja™ administrator has already approved."
      : "Enter your account email and we will send a secure password-reset link.";

  return (
    <main className="portal-login">
      <section className="portal-login-card">
        <a className="portal-login-brand" href="/">
          <Image src="/prachurja-logo-final.jpeg" alt="" width={54} height={54} unoptimized/>
          <span><b>PRACHURJA™</b><small>SECURE WORKSPACES</small></span>
        </a>
        <div className="portal-login-icon"><Leaf/></div>
        <p className="eyebrow">Protected portal</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        {initialNotice && <p className="form-error" role="alert">{initialNotice}</p>}
        {initialMessage && <p className="saved-note" role="status">{initialMessage}</p>}
        {mode !== "forgot" && <div className="portal-login-switch">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button>
          <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button>
        </div>}
        <form action={mode === "login" ? loginAction : mode === "signup" ? signupAction : recoveryAction} className="portal-login-form">
          {mode === "signup" && <label><span>Your name</span><input name="name" autoComplete="name" minLength={2} maxLength={120} required/></label>}
          <label><span>Email address</span><input name="email" type="email" autoComplete="email" required/></label>
          {mode !== "forgot" && <label><span>Password</span><input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} maxLength={128} required/></label>}
          {state.error && <p className="form-error" role="alert">{state.error}</p>}
          {state.message && <p className="saved-note" role="status">{state.message}</p>}
          <button className="button button-primary" disabled={pending}><KeyRound/>{pending ? "Please wait…" : mode === "login" ? "Sign in securely" : mode === "signup" ? "Create account" : "Send reset link"}<ArrowRight/></button>
          {mode === "login" && <button className="text-button" formAction={resendAction} formNoValidate disabled={pending}>Resend verification email</button>}
          {mode === "login" && <button className="text-button" type="button" onClick={() => setMode("forgot")} disabled={pending}>Forgot password?</button>}
          {mode === "forgot" && <button className="text-button" type="button" onClick={() => setMode("login")} disabled={pending}>Back to sign in</button>}
        </form>
        <div className="portal-login-help">
          <p>Access is controlled by your assigned role. Contact Prachurja™ if your email has not been approved.</p>
          <a href="/contact">Get help</a>
          <a href="/">Return to website</a>
        </div>
      </section>
    </main>
  );
}
