const mongoose = require("mongoose")

// name, description, category,icon
const habitSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Habit", habitSchema);
