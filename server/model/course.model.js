import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Course level is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Course rating is required"],
      min: 0,
      max: 5,
    },
    students: {
      type: Number,
      required: [true, "Students count is required"],
      min: 0,
      default: 0,
    },
    icon: {
      type: String,
      required: [true, "Course icon is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Course", courseSchema);

export default CourseModel;
