import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

import * as taskController from "../controllers/taskController.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", taskController.createTask);

// GET /api/tasks
router.get("/", taskController.getTasks);

// DELETE /api/tasks/:id
router.delete("/:id", taskController.deleteTask);

export default router;
