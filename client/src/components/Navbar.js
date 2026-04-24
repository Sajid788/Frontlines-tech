
export default function Navbar({ onExploreCourses }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#060D18]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-[90%] items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg">
          🎓
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-xl font-extrabold text-transparent">
            EduSphere
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onExploreCourses}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Explore Courses
          </button>
        </div>
      </div>
    </nav>
  );
}
