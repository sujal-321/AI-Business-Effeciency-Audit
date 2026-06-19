export function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 42; const circumference = 2 * Math.PI * radius;
  return <div className="relative grid size-28 place-items-center"><svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90"><circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="7" className="text-black/5" /><circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} className="text-cobalt" /></svg><div className="text-center"><div className="display text-3xl">{score}</div><div className="text-[10px] uppercase tracking-wider text-black/40">{label}</div></div></div>;
}
