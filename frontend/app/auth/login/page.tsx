import LoginForm from "@/components/auth/login-form";
import PlasmaBg from "@/components/ui/plasma-bg";

export default function LoginPage() {
  return (
    <div className="relative mx-auto max-w-xl space-y-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl">
      <PlasmaBg className="opacity-80" />
      <div className="relative space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Access</p>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in to IntelliCart</h1>
          <p className="text-slate-600">Authenticate to sync your cart, orders, and payments.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
