const habitSchema = require("../models/habit.model")
const createHabit = async (req,res) =>{
  try {
    const {name, description, category,icon} = req.body

    const Habits = await habitSchema.create({
        name, description, category, icon, owner: req.user.userId
    })

    return res.status(201).json({
      message: "Habit created successfully",
    });

  } catch (error) {
    console.error("Create habit error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }

}

const getHabits = async (req,res) =>{
    try {
    const owner = req.user.userId;

    const habits = await habitSchema.find({ owner });

    return res.status(200).json({
      habits,
    });
  } catch (error) {
    console.error("Get habits error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

module.exports = {createHabit, getHabits}