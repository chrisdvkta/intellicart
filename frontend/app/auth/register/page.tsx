import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Create account</p>
        <h1 className="text-3xl font-semibold text-white">Join IntelliCart</h1>
        <p className="text-white/60">Register a user or admin, then ship inventory in minutes.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
