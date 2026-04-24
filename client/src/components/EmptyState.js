export default function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24" style={{ animation: "fadeSlide 0.5s ease both" }}>
      <div className="text-6xl">🔍</div>
      <h3 className="text-2xl font-bold text-slate-200">No courses found</h3>
      <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
      <button
        onClick={onClear}
        className="mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
      >
        Clear Filters
      </button>
    </div>
  );
}
