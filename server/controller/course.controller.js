import CourseModel from "../model/course.model.js";

export const getCourses = async (req, res) => {
  try {
    let {
      category,
      instructor,
      minRating,
      maxRating,
      search,
      level,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 10, 1);
    let query = {};

    // 🔍 Category filter
    if (category) {
      query.category = category;
    }

    // 🔍 Instructor filter (exact match)
    if (instructor) {
      query.instructor = instructor;
    }

    if (level) {
      query.level = level;
    }

    // 🔍 Rating filter
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = Number(minRating);
      if (maxRating) query.rating.$lte = Number(maxRating);
    }

    // 🔍 Search (name + instructor both)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 🔃 Sorting
    const sortFieldMap = {
      rating: "rating",
      students: "students",
      name: "name",
      title: "name",
      createdAt: "createdAt",
    };
    const resolvedSortField = sortFieldMap[sortBy] || "createdAt";
    const sortOptions = { [resolvedSortField]: order === "asc" ? 1 : -1 };

    // 📄 Pagination
    const skip = (parsedPage - 1) * parsedLimit;

    const [courses, total, categories, instructors, levels] = await Promise.all([
      CourseModel.find(query).sort(sortOptions).skip(skip).limit(parsedLimit),
      CourseModel.countDocuments(query),
      CourseModel.distinct("category"),
      CourseModel.distinct("instructor"),
      CourseModel.distinct("level"),
    ]);

    res.status(200).json({
      success: true,
      message:
        courses.length > 0
          ? "Courses fetched successfully"
          : "No courses found",
      total,
      page: parsedPage,
      limit: parsedLimit,
      data: courses,
      filters: {
        categories: categories.sort(),
        instructors: instructors.sort(),
        levels: levels.sort(),
        sorts: ["Default", "Rating: High", "Rating: Low", "Name: A-Z", "Name: Z-A"],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

export const addCourse = async (req, res) => {
  const { name, instructor, duration, category, level, rating, students, icon } =
    req.body;

  if (
    !name ||
    !instructor ||
    !duration ||
    !category ||
    !level ||
    rating === undefined ||
    students === undefined ||
    !icon
  ) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields" });
  }

  try {
    const course = await CourseModel.create({
      name,
      instructor,
      duration,
      category,
      level,
      rating,
      students,
      icon,
    });

    res.status(201).json({
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCourseStats = async (req, res) => {
  try {
    const [stats] = await CourseModel.aggregate([
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          totalStudents: { $sum: "$students" },
          avgRating: { $avg: "$rating" },
          instructors: { $addToSet: "$instructor" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCourses: 1,
          totalStudents: 1,
          avgRating: 1,
          totalInstructors: { $size: "$instructors" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Course stats fetched successfully",
      data: {
        totalCourses: stats?.totalCourses || 0,
        totalInstructors: stats?.totalInstructors || 0,
        totalStudents: stats?.totalStudents || 0,
        avgRating: Number((stats?.avgRating || 0).toFixed(1)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course stats",
      error: error.message,
    });
  }
};

