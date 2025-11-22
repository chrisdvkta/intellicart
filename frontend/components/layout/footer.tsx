export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>IntelliCart — shop bright, ship fast.</span>
        <div className="flex gap-4">
          <a href="http://localhost:8000/docs" className="hover:text-slate-900">
            API Docs
          </a>
          <a href="mailto:support@intellicart.app" className="hover:text-slate-900">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
