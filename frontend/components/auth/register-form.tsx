"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, ActionResult } from "@/app/actions/auth";

const initialState: ActionResult = {};

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-white/70">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
            placeholder="Alex Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-white/70">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="••••••••"
        />
      </div>
      <input type="hidden" name="role" value="USER" />
      <button className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg">
        Create account
      </button>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
      <p className="text-center text-sm text-white/70">
        Already registered?{" "}
        <Link href="/auth/login" className="text-emerald-200 hover:text-white">
          Sign in
        </Link>
      </p>
    </form>
  );
}
