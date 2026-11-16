"use client";

import Image from "next/image";
import { useActionState } from "react";
import { ArrowRight, KeyRound, Leaf } from "lucide-react";
import { updatePassword, type PasswordState } from "@/app/reset-password/actions";

const initialState: PasswordState = {};

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialState);

  return (
    <main className="portal-login">
      <section className="portal-login-card">
        <a className="portal-login-brand" href="/">
          <Image src="/prachurja-logo-final.jpeg" alt="" width={54} height={54} unoptimized/>
          <span><b>PRACHURJA™</b><small>SECURE WORKSPACES</small></span>
        </a>
        <div className="portal-login-icon"><Leaf/></div>
        <p className="eyebrow">Account recovery</p>
        <h1>Choose a new password</h1>
        <p>Enter a new password for your Prachurja™ workspace account.</p>
        <form action={action} className="portal-login-form">
          <label><span>New password</span><input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required/></label>
          <label><span>Confirm new password</span><input name="confirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} required/></label>
          {state.error && <p className="form-error" role="alert">{state.error}</p>}
          <button className="button button-primary" disabled={pending}><KeyRound/>{pending ? "Updating…" : "Update password"}<ArrowRight/></button>
        </form>
        <div className="portal-login-help"><a href="/login">Return to sign in</a><a href="/contact">Get help</a></div>
      </section>
    </main>
  );
}
