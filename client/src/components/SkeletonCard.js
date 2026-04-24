export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="mb-4 h-12 w-12 rounded-xl bg-slate-800" />
      <div className="space-y-2">
        <div className="h-4 w-4/5 rounded-lg bg-slate-800" />
        <div className="h-3 w-3/5 rounded-lg bg-slate-800" />
      </div>
      <div className="mt-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 w-3 rounded bg-slate-800" />
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <div className="h-3 w-24 rounded bg-slate-800" />
        <div className="h-3 w-24 rounded bg-slate-800" />
      </div>
      <div className="mt-6 h-10 w-full rounded-xl bg-slate-800" />
    </div>
  );
}
