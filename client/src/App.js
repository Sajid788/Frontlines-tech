import { useEffect, useMemo, useState } from "react";
import "./App.css";
import EmptyState from "./components/EmptyState";
import FilterBar from "./components/FilterBar";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import SkeletonCard from "./components/SkeletonCard";
import { CAT_STYLE, LEVEL_STYLE, PER_PAGE } from "./constants/courseStyles";
import { fetchCourses, fetchCourseStats } from "./services/courseApi";

export default function App() {
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [loading, setLoading] = useState(true);
  const [courseStats, setCourseStats] = useState(null);
  const [search, setSearch] = useState(initialParams.get("search") || "");
  const [category, setCategory] = useState(initialParams.get("category") || "All");
  const [instructor, setInstructor] = useState(initialParams.get("instructor") || "All");
  const [level, setLevel] = useState(initialParams.get("level") || "All");
  const [sort, setSort] = useState(initialParams.get("sort") || "Default");
  const [page, setPage] = useState(Math.max(Number(initialParams.get("page") || 1), 1));
  const [searchFocus, setSearchFocus] = useState(false);
  const [hoveredCourseKey, setHoveredCourseKey] = useState(null);
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [error, setError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    instructors: [],
    levels: [],
    sorts: ["Default", "Rating: High", "Rating: Low", "Name: A-Z", "Name: Z-A"],
  });

  const resetPage = () => setPage(1);

  useEffect(() => {
    const controller = new AbortController();
    const loadStats = async () => {
      const stats = await fetchCourseStats({ signal: controller.signal });
      setCourseStats(stats);
    };
    loadStats();
    return () => controller.abort();
  }, []);

  const resetFilters = () => {
    setCategory("All");
    setInstructor("All");
    setLevel("All");
    setSort("Default");
    setSearch("");
    resetPage();
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "All") params.set("category", category);
    if (instructor !== "All") params.set("instructor", instructor);
    if (level !== "All") params.set("level", level);
    if (sort !== "Default") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    const queryString = params.toString();
    const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
  }, [category, instructor, level, page, search, sort]);

  useEffect(() => {
    const controller = new AbortController();
    const sortMap = {
      Default: { sortBy: "createdAt", order: "desc" },
      "Rating: High": { sortBy: "rating", order: "desc" },
      "Rating: Low": { sortBy: "rating", order: "asc" },
      "Name: A-Z": { sortBy: "name", order: "asc" },
      "Name: Z-A": { sortBy: "name", order: "desc" },
    };

    const loadCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const selectedSort = sortMap[sort] || sortMap.Default;
        const result = await fetchCourses({
          page,
          limit: PER_PAGE,
          category: category === "All" ? "" : category,
          instructor: instructor === "All" ? "" : instructor,
          level: level === "All" ? "" : level,
          search: search.trim(),
          sortBy: selectedSort.sortBy,
          order: selectedSort.order,
          signal: controller.signal,
        });
        setCourses(result.courses);
        setTotalCourses(result.total);
        setFilterOptions((prev) => ({
          categories: result.filters.categories || prev.categories,
          instructors: result.filters.instructors || prev.instructors,
          levels: result.filters.levels || prev.levels,
          sorts: result.filters.sorts?.length ? result.filters.sorts : prev.sorts,
        }));
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Unable to load courses");
          setCourses([]);
          setTotalCourses(0);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
    return () => controller.abort();
  }, [category, instructor, level, page, search, sort]);

  const hasFilter = category !== "All" || instructor !== "All" || level !== "All" || sort !== "Default" || !!search;
  const totalPages = Math.ceil(totalCourses / PER_PAGE);

  const scrollToCourses = () => {
    const target = document.getElementById("courses-section");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#060D18] font-sans text-slate-200">
      <Navbar onExploreCourses={scrollToCourses} />
      <HeroSection stats={courseStats} onExploreCourses={scrollToCourses} />

      <FilterBar
        search={search}
        setSearch={setSearch}
        searchFocus={searchFocus}
        setSearchFocus={setSearchFocus}
        category={category}
        setCategory={setCategory}
        instructor={instructor}
        setInstructor={setInstructor}
        level={level}
        setLevel={setLevel}
        sort={sort}
        setSort={setSort}
        instructors={filterOptions.instructors}
        categories={filterOptions.categories}
        levels={filterOptions.levels}
        sorts={filterOptions.sorts}
        hasFilter={hasFilter}
        resetFilters={resetFilters}
        resetPage={resetPage}
      />

      <main id="courses-section" className="mx-auto w-[90%]  pb-24 pt-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
              {category !== "All" ? category : "All Courses"}
            </h2>
            {!loading ? (
              <p className="mt-1 text-sm text-slate-600">
                Showing {courses.length} of {totalCourses} course{totalCourses !== 1 ? "s" : ""}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", ...filterOptions.categories].slice(0, 5).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(item);
                  resetPage();
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  category === item
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "border border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: PER_PAGE }).map((_, index) => <SkeletonCard key={index} />)
            : courses.map((course, index) => {
                const cardKey = course.id || `${course.title}-${course.instructor}-${index}`;
                const isHovering = hoveredCourseKey === cardKey;
                const categoryStyle = CAT_STYLE[course.category] || CAT_STYLE["Web Dev"];
                const levelLabel = course.level || "Beginner";
                const levelStyle = LEVEL_STYLE[levelLabel] || LEVEL_STYLE.Beginner;

                return (
                  <div
                    key={cardKey}
                    onMouseEnter={() => setHoveredCourseKey(cardKey)}
                    onMouseLeave={() => setHoveredCourseKey(null)}
                    className={`
                      relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800
                      bg-gradient-to-br from-slate-900 to-slate-950 p-6 transition-all duration-300 ease-out
                      ${categoryStyle.glow} hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
                    `}
                    style={{ animationDelay: `${index * 80}ms`, animation: "fadeSlide 0.5s ease both" }}
                  >
                    <div
                      className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500 blur-2xl transition-opacity duration-300 ${isHovering ? "opacity-30" : "opacity-0"}`}
                    />
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${categoryStyle.icon}`}
                      >
                        {course.icon}
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold tracking-widest ${levelStyle}`}
                      >
                        {levelLabel.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="mb-1 text-[15px] font-bold leading-snug text-slate-100">{course.title}</h3>
                    <p className="mb-3 text-xs text-slate-500">by {course.instructor}</p>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <svg
                          key={value}
                          className={`h-3 w-3 ${value <= course.rating ? "text-amber-400" : "text-slate-700"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs font-semibold text-slate-400">{course.rating}</span>
                    </div>

                    <div className="my-4 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {course.students}
                      </span>
                    </div>

                    <div className="mt-auto border-t border-slate-800 pt-4">
                      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {course.duration}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryStyle.pill}`}>
                          {course.category}
                        </span>
                      </div>
                      <button
                        className={`w-full rounded-xl border py-2.5 text-sm font-bold transition-all duration-300 ${
                          isHovering
                            ? "border-violet-500 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-violet-500/30"
                            : "border-violet-500/70 bg-transparent text-slate-300"
                        }`}
                      >
                        {isHovering ? "Enroll Now →" : "View Course"}
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

        {!loading && !error && courses.length === 0 ? <EmptyState onClear={resetFilters} /> : null}
        {error ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        ) : null}

        {totalPages > 1 ? (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-500 transition-all hover:border-slate-600 hover:text-slate-300 disabled:opacity-30"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                onClick={() => setPage(value)}
                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                  value === page
                    ? "border-0 bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                    : "border border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {value}
              </button>
            ))}
            <button
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-500 transition-all hover:border-slate-600 hover:text-slate-300 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-slate-800 bg-[#060D18] py-10 text-center">
        <div className="mb-3 flex items-center justify-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-sm">
            🎓
          </div>
          <span className="text-lg font-extrabold text-slate-200">EduSphere</span>
        </div>
        <p className="text-sm text-slate-700">© 2026 EduSphere. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
