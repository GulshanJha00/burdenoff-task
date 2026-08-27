const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    localDay: {
      type: String,
      required: true,
    },

    checkedInAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
checkInSchema.index(
  { habit: 1, localDay: 1 },
  { unique: true }
);
module.exports = mongoose.model("checkIn",checkInSchema)