const perks = [
  { title: "Free shipping over $75", detail: "Automatic at checkout—no codes." },
  { title: "Seamless returns", detail: "Print-free, drop-off friendly." },
  { title: "Live inventory", detail: "If you can add it, it’s in stock." },
];

export default function Perks() {
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-3 shadow-lg">
      {perks.map((perk) => (
        <div key={perk.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">{perk.title}</h3>
          <p className="text-sm text-slate-600">{perk.detail}</p>
        </div>
      ))}
    </div>
  );
}
