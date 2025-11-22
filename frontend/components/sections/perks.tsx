const perks = [
  { title: "Free shipping over $75", detail: "Automatic at checkout—no codes." },
  { title: "Seamless returns", detail: "Print-free, drop-off friendly." },
  { title: "Live inventory", detail: "If you can add it, it’s in stock." },
];

export default function Perks() {
  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-3">
      {perks.map((perk) => (
        <div key={perk.title} className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-white">
          <h3 className="text-sm font-semibold">{perk.title}</h3>
          <p className="text-sm text-white/70">{perk.detail}</p>
        </div>
      ))}
    </div>
  );
}
