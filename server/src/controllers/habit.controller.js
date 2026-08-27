const habitSchema = require("../models/habit.model");
const checkInSchema = require("../models/checkin.model");
const User = require("../models/auth.model");
const calculateStreaks = require("../utils/streak");

const createHabit = async (req, res) => {
  try {
    const { name, description, category, icon } = req.body;

    const Habits = await habitSchema.create({
      name,
      description,
      category,
      icon,
      owner: req.user.userId,
    });

    return res.status(201).json({
      message: "Habit created successfully",
    });
  } catch (error) {
    console.error("Create habit error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getHabits = async (req, res) => {
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
};

const createCheckIn = async (req, res) => {
  try {
    const { habitId, localDay } = req.body;

    const userId = req.user.userId;

    const habit = await habitSchema.findOne({
      _id: habitId,
      owner: userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const timezone = user.timezone;

    const todayLocalDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const checkInDay = localDay || todayLocalDay;

    console.log("Timezone:", timezone);
    console.log("Today:", todayLocalDay);
    console.log("Requested day:", checkInDay);

    if (checkInDay > todayLocalDay) {
      return res.status(400).json({
        message: "You cannot check in for a future date",
      });
    }

    const habitCreatedLocalDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(habit.createdAt);

    console.log("Habit created local day:", habitCreatedLocalDay);

    if (checkInDay < habitCreatedLocalDay) {
      return res.status(400).json({
        message: "You cannot check in before the habit was created",
      });
    }

    const checkIn = await checkInSchema.create({
      habit: habitId,
      user: userId,
      localDay: checkInDay,
      checkedInAt: new Date(),
    });
    const checkIns = await checkInSchema.find({
      habit: habitId,
    });

    const days = checkIns.map((checkIn) => checkIn.localDay);
    const { currentStreak, longestStreak } =
  calculateStreaks(days, todayLocalDay);

return res.status(201).json({
  message: "Habit checked in successfully",
  checkIn,
  currentStreak,
  longestStreak,
});
  } catch (error) {
    // Duplicate habit + localDay
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Habit already checked in on this day",
      });
    }

    console.error("Create check-in error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getTodayCheckIn = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    const todayLocalDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: user.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const checkIn = await checkInSchema.findOne({
      habit: habitId,
      user: userId,
      localDay: todayLocalDay,
    });

    return res.status(200).json({
      checkedIn: !!checkIn,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.userId;

    // Make sure the habit belongs to this user
    const habit = await habitSchema.findOne({
      _id: habitId,
      owner: userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    // Delete the habit
    await habitSchema.deleteOne({
      _id: habitId,
    });

    // Delete all check-ins belonging to this habit
    await checkInSchema.deleteMany({
      habit: habitId,
    });

    return res.status(200).json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error("Delete habit error:", error);

    return res.status(500).json({
      message: "Something went wrong while deleting the habit",
    });
  }
};

const getStreak = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.userId;

    const habit = await habitSchema.findOne({
      _id: habitId,
      owner: userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const todayLocalDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: user.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const checkIns = await checkInSchema.find({
      habit: habitId,
      user: userId,
    });

    const days = checkIns.map(
      (checkIn) => checkIn.localDay
    );

    const {
      currentStreak,
      longestStreak,
    } = calculateStreaks(
      days,
      todayLocalDay
    );

    return res.status(200).json({
      currentStreak,
      longestStreak,
    });

  } catch (error) {
    console.error("Get streak error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getHabitSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const todayLocalDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: user.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    // Get all user's habits
    const habits = await habitSchema.find({
      owner: userId,
    });

    if (habits.length === 0) {
      return res.status(200).json({
        currentStreak: 0,
        bestStreak: 0,
        todayProgress: 0,
        completedToday: 0,
        totalHabits: 0,
      });
    }

    let highestCurrentStreak = 0;
    let highestLongestStreak = 0;

    // Calculate streaks for every habit
    for (const habit of habits) {
      const checkIns = await checkInSchema.find({
        habit: habit._id,
        user: userId,
      });

      const days = checkIns.map(
        (checkIn) => checkIn.localDay
      );

      const {
        currentStreak,
        longestStreak,
      } = calculateStreaks(
        days,
        todayLocalDay
      );

      highestCurrentStreak = Math.max(
        highestCurrentStreak,
        currentStreak
      );

      highestLongestStreak = Math.max(
        highestLongestStreak,
        longestStreak
      );
    }

    // Today's completed habits
    const todayCheckIns = await checkInSchema.countDocuments({
      user: userId,
      localDay: todayLocalDay,
    });

    const todayProgress = Math.round(
      (todayCheckIns / habits.length) * 100
    );

    return res.status(200).json({
      currentStreak: highestCurrentStreak,
      bestStreak: highestLongestStreak,
      todayProgress,
      completedToday: todayCheckIns,
      totalHabits: habits.length,
    });

  } catch (error) {
    console.error(
      "Get habit summary error:",
      error
    );

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { createHabit, getHabits, createCheckIn, getTodayCheckIn,deleteHabit, getStreak, getHabitSummary };
