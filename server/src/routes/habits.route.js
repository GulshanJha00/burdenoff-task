const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const HabitRoute = express.Router()
const {createHabit,getHabits} = require("../controllers/habit.controller")


HabitRoute.post("/create",authMiddleware, createHabit)
HabitRoute.get("/get",authMiddleware, getHabits)


module.exports = HabitRoute