import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Access</p>
        <h1 className="text-3xl font-semibold text-white">Sign in to IntelliCart</h1>
        <p className="text-white/60">Authenticate to sync your cart, orders, and payments.</p>
      </div>
      <LoginForm />
    </div>
  );
}
