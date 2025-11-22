"use client";

type Props = {
  className?: string;
};

export default function PlasmaBg({ className = "" }: Props) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute inset-[-28%] animate-plasma mix-blend-screen rounded-[55%] bg-[conic-gradient(from_var(--angle),#c084fc,#38bdf8,#22c55e,#f59e0b,#f472b6,#c084fc)] opacity-[0.95] blur-[70px]" />
      <div className="absolute inset-[-18%] animate-plasma-slow mix-blend-screen rounded-[55%] bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.7),transparent_42%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.65),transparent_48%)] opacity-[0.8] blur-[90px]" />
    </div>
  );
}
