export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <span>IntelliCart — built for product teams shipping fast.</span>
        <div className="flex gap-4">
          <a href="http://localhost:8000/docs" className="hover:text-white">
            API Docs
          </a>
          <a href="mailto:support@intellicart.app" className="hover:text-white">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
