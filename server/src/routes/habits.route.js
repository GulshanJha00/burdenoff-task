const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const HabitRoute = express.Router()

const {
  createHabit,
  getHabits,
  createCheckIn,
  getTodayCheckIn,
  getStreak,
  getHabitSummary,
  deleteHabit,
} = require("../controllers/habit.controller");


HabitRoute.post("/create",authMiddleware, createHabit)
HabitRoute.get("/get",authMiddleware, getHabits)
HabitRoute.post("/checkin", authMiddleware, createCheckIn)
HabitRoute.get(
  "/:habitId/checkin",
  authMiddleware,
  getTodayCheckIn
);
HabitRoute.delete(
  "/:habitId",
  authMiddleware,
  deleteHabit
);

HabitRoute.get(
  "/:habitId/streak",
  authMiddleware,
  getStreak
);

HabitRoute.get(
  "/summary",
  authMiddleware,
  getHabitSummary
);
module.exports = HabitRoute