const API_BASE_URL = "https://frontlines-tech.vercel.app";

// helper
const formatStudents = (value) => {
  const count = Number(value || 0);
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : `${count}`;
};

const formatCompactNumber = (value) => {
  const num = Number(value || 0);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}b`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}m`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return `${num}`;
};

export async function fetchCourses(filters = {}) {
  try {
    const signal = filters.signal;
    delete filters.signal;

    // build query string
    let query = "";
    for (let key in filters) {
      if (filters[key]) {
        query += `${key}=${filters[key]}&`;
      }
    }

    const url = `${API_BASE_URL}/api/courses${query ? "?" + query : ""}`;

    const res = await fetch(url, { signal });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch courses");
    }

    // map courses
    const courses = (data.data || []).map((c) => ({
      id: c._id,
      title: c.name,
      instructor: c.instructor,
      category: c.category,
      duration: c.duration,
      level: c.level,
      rating: Number(c.rating || 0),
      students: formatStudents(c.students),
      icon: c.icon,
    }));

    return {
      courses,
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,

      // always return filters 
      filters: data.filters || {
        categories: [],
        instructors: [],
        levels: [],
        sorts: [],
      },
    };

  } catch (err) {
    console.log("Error:", err.message);

    return {
      courses: [],
      total: 0,
      page: 1,
      limit: 10,
      filters: { categories: [], instructors: [], levels: [], sorts: [] },
    };
  }
}

export async function fetchCourseStats({ signal } = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/courses/stats`, { signal });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch stats");
    }

    const stats = data.data;

    return {
      totalCourses: stats.totalCourses,
      totalInstructors: stats.totalInstructors,
      totalStudents: stats.totalStudents,
      avgRating: stats.avgRating,

      // for UI
      totalCoursesLabel: stats.totalCourses + "+",
      totalInstructorsLabel: String(stats.totalInstructors),
      totalStudentsLabel: formatCompactNumber(stats.totalStudents),
      avgRatingLabel: stats.avgRating.toFixed(1) + "★",
    };

  } catch (err) {
    console.log("Error:", err.message);

    return {
      totalCourses: 0,
      totalInstructors: 0,
      totalStudents: 0,
      avgRating: 0,
      totalCoursesLabel: "0+",
      totalInstructorsLabel: "0",
      totalStudentsLabel: "0",
      avgRatingLabel: "0.0★",
    };
  }
}