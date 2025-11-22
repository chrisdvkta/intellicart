"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, ActionResult } from "@/app/actions/auth";

const initialState: ActionResult = {};

export default function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="space-y-1">
        <label className="text-sm text-slate-700">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-700">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="••••••••"
        />
      </div>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button className="w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
        Sign in
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <p className="text-center text-sm text-slate-700">
        New here?{" "}
        <Link href="/auth/register" className="text-emerald-700 hover:text-emerald-600">
          Create an account
        </Link>
      </p>
    </form>
  );
}
