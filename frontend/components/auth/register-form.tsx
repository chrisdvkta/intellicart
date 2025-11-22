"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, ActionResult } from "@/app/actions/auth";

const initialState: ActionResult = {};

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-slate-700">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
            placeholder="Alex Doe"
          />
        </div>
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
      <input type="hidden" name="role" value="USER" />
      <button className="w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
        Create account
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <p className="text-center text-sm text-slate-700">
        Already registered?{" "}
        <Link href="/auth/login" className="text-emerald-700 hover:text-emerald-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}
