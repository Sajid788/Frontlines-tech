export default function HeroSection({ stats, onExploreCourses }) {
  const items = [
    [stats?.totalCoursesLabel ?? "0+", "Courses"],
    [stats?.totalInstructorsLabel ?? "0", "Instructors"],
    [stats?.totalStudentsLabel ?? "0", "Students"],
    [stats?.avgRatingLabel ?? "0.0★", "Avg Rating"],
  ];

  return (
    <section className="relative overflow-hidden bg-[#060D18] px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-3xl" />
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-indigo-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-pink-600/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/15 px-4 py-1.5 text-xs font-semibold tracking-wider text-violet-300">
          <span className="h-2 w-2 rounded-full bg-violet-500" style={{ animation: "blink 2s infinite" }} />
          12 NEW COURSES ADDED THIS WEEK
        </div>

        <h1 className="mb-6 text-5xl font-black leading-none tracking-tight md:text-7xl">
          Learn without{" "}
          <span
            className="bg-gradient-to-r from-violet-400 via-pink-400 to-sky-400 bg-clip-text text-transparent"
            style={{ backgroundSize: "200%", animation: "gradShift 5s ease infinite" }}
          >
            limits
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-500">
          Explore 120+ expert-led courses in design, development, data science, and more - all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onExploreCourses}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-bold tracking-wide text-white transition-all hover:scale-105 hover:opacity-90"
          >
            Explore Courses →
          </button>
          <button className="rounded-2xl border border-slate-700 px-8 py-3.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-500 hover:text-slate-300">
            Watch Demo
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-12">
          {items.map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black tracking-tight text-white">{value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
