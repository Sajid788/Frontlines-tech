import { useState } from "react";

export default function FilterBar({
  search,
  setSearch,
  searchFocus,
  setSearchFocus,
  category,
  setCategory,
  instructor,
  setInstructor,
  level,
  setLevel,
  sort,
  setSort,
  instructors,
  categories,
  levels,
  sorts,
  hasFilter,
  resetFilters,
  resetPage,
}) {
  const [instructorOpen, setInstructorOpen] = useState(false);
  const instructorOptions = ["All", ...(instructors || [])];

  return (
    <div className="sticky top-16 z-40 border-y border-slate-800 bg-slate-950/95  py-4 backdrop-blur-md">
      <div className="mx-auto flex w-[90%] flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <svg
            className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
              searchFocus ? "text-violet-400" : "text-slate-600"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search courses, instructors..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            className={`w-full rounded-xl border bg-slate-900 py-2.5 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all ${
              searchFocus
                ? "border-violet-500/60 ring-2 ring-violet-500/20"
                : "border-slate-800 hover:border-slate-700"
            }`}
          />
          {search ? (
            <button
              onClick={() => {
                setSearch("");
                resetPage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base leading-none text-slate-600 transition-colors hover:text-slate-400"
            >
              ✕
            </button>
          ) : null}
        </div>

        <div className={`relative ${instructorOpen ? "z-50" : "z-10"}`}>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              resetPage();
            }}
            className="min-w-[148px] cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pr-9 text-sm text-slate-400 outline-none transition-all hover:border-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          >
            {["All", ...(categories || [])].map((option) => (
              <option key={option} value={option} className="bg-slate-900 text-slate-300">
                {option === "All" ? "All Categories" : option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setInstructorOpen((v) => !v)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setInstructorOpen(false);
            }}
            className="min-w-[148px] cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pr-9 text-left text-sm text-slate-400 outline-none transition-all hover:border-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            aria-haspopup="listbox"
            aria-expanded={instructorOpen}
          >
            {instructor === "All" ? "All Instructors" : instructor}
          </button>

          {instructorOpen ? (
            <div
              className="thin-scrollbar absolute left-0 right-0 top-full mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-2xl shadow-black/40"
              role="listbox"
              tabIndex={-1}
            >
              {instructorOptions.map((option) => {
                const selected = option === instructor;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setInstructor(option);
                      resetPage();
                      setInstructorOpen(false);
                    }}
                    className={`w-full z-10 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selected ? "bg-violet-500/15 text-slate-100" : "text-slate-300 hover:bg-slate-900"
                    }`}
                    role="option"
                    aria-selected={selected}
                  >
                    {option === "All" ? "All Instructors" : option}
                  </button>
                );
              })}
            </div>
          ) : null}

          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="relative">
          <select
            value={level}
            onChange={(event) => {
              setLevel(event.target.value);
              resetPage();
            }}
            className="min-w-[148px] cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pr-9 text-sm text-slate-400 outline-none transition-all hover:border-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          >
            {["All", ...(levels || [])].map((option) => (
              <option key={option} value={option} className="bg-slate-900 text-slate-300">
                {option === "All" ? "All Levels" : option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              resetPage();
            }}
            className="min-w-[148px] cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 pr-9 text-sm text-slate-400 outline-none transition-all hover:border-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          >
            {(sorts && sorts.length > 0 ? sorts : ["Default", "Rating: High", "Rating: Low", "Name: A-Z", "Name: Z-A"]).map((option) => (
              <option key={option} value={option} className="bg-slate-900 text-slate-300">
                {option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {hasFilter ? (
          <button
            onClick={resetFilters}
            className="whitespace-nowrap rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20"
          >
            Clear ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
