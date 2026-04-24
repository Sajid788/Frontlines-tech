import express from "express";
import {
  addCourse,
  getCourseStats,
  getCourses,
} from "../controller/course.controller.js";


const router = express.Router();

// GET all courses
router.get("/", getCourses);
router.get("/stats", getCourseStats);

// POST add course
router.post("/", addCourse);

export default router;
